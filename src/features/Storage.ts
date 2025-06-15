import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SecureStoreOptions } from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Storage(
	key: string,
	secureIfPossible = false,
	secureStoreOptions?: SecureStoreOptions
) {
	return {
		key,
		secureIfPossible,
		secureStoreOptions,
		async get() {
			// secure-store is not available on web
			if (Platform.OS === "web" || !secureIfPossible) {
				return await AsyncStorage.getItem(key);
			}
			try {
				return await SecureStore.getItemAsync(key, secureStoreOptions);
			} catch (error) {
				console.error("An error occurred while reading data from SecureStore", error);
				await SecureStore.deleteItemAsync(key, secureStoreOptions);
				return null;
			}
		},
		set(value: string) {
			// secure-store is not available on web
			if (Platform.OS === "web" || !secureIfPossible) {
				return AsyncStorage.setItem(key, value);
			}
			return SecureStore.setItemAsync(key, value, secureStoreOptions);
		},
		remove() {
			// secure-store is not available on web
			if (Platform.OS === "web" || !secureIfPossible) {
				return AsyncStorage.removeItem(key);
			}
			return SecureStore.deleteItemAsync(key, secureStoreOptions);
		},
	};
}

export type StorageType = ReturnType<typeof Storage>;
