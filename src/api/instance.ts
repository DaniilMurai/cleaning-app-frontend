import qs from "qs";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiUrl, NOT_REFRESH_TOKEN_URLS } from "@/constants";
import { AccessTokenStorage, RefreshTokenStorage } from "@/core/auth/storage";
import ConcurrentActionHandler from "@/features/ConcurrentActionHandler";
import { TokenPair } from "@/api/auth";
import { removeTokens, updateTokens } from "@/core/auth/helpers";
import { OnAuthChangeCallbacks } from "@/core/auth";

export const AXIOS_INSTANCE = Axios.create({
	baseURL: ApiUrl,
	withCredentials: true, // Важно для CORS
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

AXIOS_INSTANCE.defaults.params = {};

// Интерцептор для добавления access-токена в заголовки
AXIOS_INSTANCE.interceptors.request.use(async config => {
	const accessToken = await AccessTokenStorage.get();
	if (accessToken && !("Authorization" in config.headers)) {
		config["headers"]["Authorization"] = accessToken;
	}
	return config;
});

const refreshTokenHandler = new ConcurrentActionHandler();

AXIOS_INSTANCE.interceptors.response.use(
	response => response,
	async originalError => {
		const originalRequest = { ...originalError.config };

		// Проверяем, что это ошибка авторизации и запрос еще не повторялся
		if (
			originalError.response?.status === 401 &&
			!NOT_REFRESH_TOKEN_URLS.includes(originalRequest.url)
		) {
			if (!originalRequest._retry) {
				originalRequest._retry = true;
				const refreshToken = await RefreshTokenStorage.get();
				if (refreshToken) {
					try {
						const data = await refreshTokenHandler
							.execute(async () => {
								console.log("refreshing token...");
								const result = await AXIOS_INSTANCE<TokenPair>({
									url: `/auth/refresh_tokens`,
									method: "POST",
									data: {
										refresh_token: refreshToken,
									},
									cancelToken: originalRequest.cancelToken,
								});

								console.log("token refreshed");

								return result;
							})
							.then(({ data }) => data);

						await updateTokens(data);
						await Promise.resolve(OnAuthChangeCallbacks.onTokenRefreshed(data));
						delete originalRequest.headers["Authorization"];
						return await AXIOS_INSTANCE(originalRequest);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} catch (refreshTokenError: any) {
						if (refreshTokenError?.response?.status !== 401) {
							console.error(
								"An error occurred while refreshing token",
								refreshTokenError
							);
							return Promise.reject(refreshTokenError);
						} else {
							console.log("Unauthorised while refreshing token. Logging out");
						}
					}
				}
			}
			await removeTokens();
			await Promise.resolve(OnAuthChangeCallbacks.onTokenRefreshFailed());
		}
		return Promise.reject(originalError);
	}
);

export const getAxios = async <T>(config: AxiosRequestConfig): Promise<T> => {
	const source = Axios.CancelToken.source();
	return AXIOS_INSTANCE({
		...config,
		cancelToken: source.token,
		paramsSerializer: params => {
			params = Object.fromEntries(
				Object.entries(params).map(([k, v]) => {
					if (Array.isArray(v)) {
						return [k, v.map(el => (typeof el === "object" ? JSON.stringify(el) : el))];
					} else if (typeof v === "object" && v !== null) {
						return [k, JSON.stringify(v)];
					} else {
						return [k, v];
					}
				})
			);
			return qs.stringify(params, {
				arrayFormat: "repeat",
				skipNulls: true,
			});
		},
	}).then(({ data }) => data);
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;
