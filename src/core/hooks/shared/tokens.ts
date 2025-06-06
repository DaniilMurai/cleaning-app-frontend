import * as SecureStore from "expo-secure-store";
import { useRefreshTokens } from "@/api/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Save tokens to storage
export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
	if (Platform.OS === "web") {
		await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	} else {
		await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
		await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
	}
};

// Get tokens from storage
export const getTokens = async (): Promise<{
	accessToken: string | null;
	refreshToken: string | null;
}> => {
	if (Platform.OS === "web") {
		const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
		return { accessToken, refreshToken };
	} else {
		const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
		const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
		return { accessToken, refreshToken };
	}
};

// Clear tokens from storage
export const clearTokens = async (): Promise<void> => {
	if (Platform.OS === "web") {
		await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
		await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
	} else {
		await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
		await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
	}
};

// Refresh access token logic
export const refreshAccessToken = async (): Promise<string | null> => {
	const { refreshToken } = await getTokens();

	if (!refreshToken) {
		console.warn("No refresh token found");
		return null;
	}
	const refreshTokensMutation = useRefreshTokens();

	try {
		// Send a request to refresh the access token
		const response = await refreshTokensMutation.mutateAsync({
			data: { refresh_token: refreshToken },
		});

		const newAccessToken = response.access_token;
		const newRefreshToken = response.refresh_token;
		// Save the new access token
		if (newAccessToken) {
			await saveTokens(newAccessToken, newRefreshToken);
			return newAccessToken;
		}
		return null;
	} catch (error) {
		console.error("Failed to refresh access token", error);
		await clearTokens(); // Optional: clear tokens in case of critical error
		return null;
	}
};
