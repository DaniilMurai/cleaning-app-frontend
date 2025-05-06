import qs from "qs";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiUrl } from "@/constants";
import { clearTokens, getTokens, refreshAccessToken } from "@/hooks/tokens";
import { redirectToLogin } from "@/app/context/AuthContext";

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
	const tokens = await getTokens();
	if (tokens.accessToken) {
		config.headers.Authorization = `Bearer ${tokens.accessToken}`;
	}
	return config;
});

AXIOS_INSTANCE.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		// Проверяем, что это ошибка авторизации и запрос еще не повторялся
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();
				if (newAccessToken) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return AXIOS_INSTANCE(originalRequest);
				} else {
					// Если не удалось получить новый токен
					await clearTokens();
					redirectToLogin();
					return Promise.reject(error);
				}
			} catch (refreshError) {
				await clearTokens();
				redirectToLogin();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
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
