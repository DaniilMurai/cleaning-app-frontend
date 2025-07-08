import { defineConfig } from "orval";
import Transformer from "./src/api/transformer";
import dotenv from "dotenv";

dotenv.config({
	path: [".env.development", ".env"],
});

const ApiUrl = process.env.EXPO_PUBLIC_API_URL;

export default defineConfig({
	core: {
		input: `${ApiUrl}/openapi.json`,
		output: {
			mode: "tags-split",
			workspace: "./src/api/core/",
			target: "./requests.ts",
			schemas: "./schemas",
			baseUrl: "/",
			client: "react-query",
			prettier: true,
			allParamsOptional: true,
			clean: true,
			headers: true,
			override: {
				query: {
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
					useInfinite: true,
				},
				transformer: Transformer,
				mutator: {
					path: ".././instance.ts",
					name: "getAxios",
				},
			},
		},
	},
	auth: {
		input: `${ApiUrl}/auth/openapi.json`,
		output: {
			mode: "tags-split",
			workspace: "./src/api/auth",
			target: "./requests.ts",
			schemas: "./schemas",
			baseUrl: "/auth",
			client: "react-query",
			prettier: true,
			allParamsOptional: true,
			clean: true,
			headers: true,
			override: {
				query: {
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
					useInfinite: true,
				},
				transformer: Transformer,

				mutator: {
					path: ".././instance.ts",
					name: "getAxios",
				},
			},
		},
	},
	users: {
		input: `${ApiUrl}/users/openapi.json`,
		output: {
			mode: "tags-split",
			workspace: "./src/api/users/",
			target: "./requests.ts",
			schemas: "./schemas",
			baseUrl: "/users",
			client: "react-query",
			prettier: true,
			allParamsOptional: true,
			clean: true,
			headers: true,
			override: {
				query: {
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
					useInfinite: true,
				},
				transformer: Transformer,

				mutator: {
					path: ".././instance.ts",
					name: "getAxios",
				},
			},
		},
	},
	admin: {
		input: `${ApiUrl}/admin/openapi.json`,
		output: {
			mode: "tags-split",
			workspace: "./src/api/admin/",
			target: "./requests.ts",
			schemas: "./schemas",
			baseUrl: "/admin",
			client: "react-query",
			prettier: true,
			allParamsOptional: true,
			clean: true,
			headers: true,
			override: {
				query: {
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
					useInfinite: true,
				},
				transformer: Transformer,

				mutator: {
					path: ".././instance.ts",
					name: "getAxios",
				},
			},
		},
	},
	client: {
		input: `${ApiUrl}/client/openapi.json`,
		output: {
			mode: "tags-split",
			workspace: "./src/api/client/",
			target: "./requests.ts",
			schemas: "./schemas",
			baseUrl: "/client",
			client: "react-query",
			prettier: true,
			allParamsOptional: true,
			clean: true,
			headers: true,
			override: {
				query: {
					useSuspenseQuery: true,
					useSuspenseInfiniteQuery: true,
					useInfinite: true,
				},
				transformer: Transformer,
				
				mutator: {
					path: ".././instance.ts",
					name: "getAxios",
				},
			},
		},
	},
});
