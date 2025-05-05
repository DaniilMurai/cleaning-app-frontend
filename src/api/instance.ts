import qs from "qs";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiUrl } from "@/constants";

export const AXIOS_INSTANCE = Axios.create({
	baseURL: ApiUrl,
	withCredentials: true, // Важно для CORS
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});

AXIOS_INSTANCE.defaults.params = {};


AXIOS_INSTANCE.interceptors.response.use(
	(response) => {
		console.log('✅ Response:', response.data);
		return response;
	},
	(error) => {
		console.error('❌ Response Error:', {
			message: error.message,
			response: error.response?.data,
			status: error.response?.status
		});
		return Promise.reject(error);
	}
);

// Остальной код остается без изменений


export const getAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
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
