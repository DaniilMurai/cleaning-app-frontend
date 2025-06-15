import { Platform } from "react-native";

export const DEFAULT_LANG = process.env.EXPO_PUBLIC_DEFAULT_LANG || "en";
export const ApiUrl =
	(Platform.OS === "android"
		? process.env.EXPO_PUBLIC_ANDROID_API_URL || process.env.EXPO_PUBLIC_API_URL
		: process.env.EXPO_PUBLIC_API_URL) || "https://cleaningcompanybackend.onrender.com/";

// Добавьте проверку
console.log("API URL:", ApiUrl);
if (!ApiUrl) {
	console.error("API URL is not defined!");
}

export const NOT_REFRESH_TOKEN_URLS = ["/auth/refresh_token", "/auth/logout", "/auth/new_login"];
