// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
// import * as SecureStore from 'expo-secure-store'; // вместо AsyncStorage
import { getTokens } from "@/hooks/tokens";
import { useRouter } from "expo-router";

interface AuthContextValue {
	token: string | null;
	loading: boolean;
	logout: () => Promise<void>;
	checkToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const redirectToLogin = () => {
	// Очищаем историю навигации и перенаправляем на логин
	const router = useRouter();
	router.replace("/Login");
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<unknown>(null);
	const [loading, setLoading] = useState(true);

	const checkToken = async () => {
		setLoading(true);
		try {
			const tokens = await getTokens();
			if (tokens?.accessToken) {
				setToken(tokens.accessToken);
				return true;
			}
			return false;
		} catch (e) {
			console.error("Ошибка при загрузке токена:", e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setToken(null);
		// setUser(null);
		// await SecureStore.deleteItemAsync('authToken');
	};

	return (
		<AuthContext.Provider value={{ token, loading, logout, checkToken }}>
			{children}
		</AuthContext.Provider>
	);
}

export default function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
