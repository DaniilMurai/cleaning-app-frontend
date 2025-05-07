// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import * as SecureStore from 'expo-secure-store'; // вместо AsyncStorage
import { clearTokens, getTokens } from "@/hooks/tokens";
import { router, useRouter } from "expo-router";

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

export const redirectToLogin = (router: ReturnType<typeof useRouter>) => {
	router.replace("/Login");
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Добавьте эффект для начальной проверки токена
	useEffect(() => {
		const initializeAuth = async () => {
			setLoading(true);
			try {
				const tokens = await getTokens();

				setToken(tokens?.accessToken || null);
			} catch (e) {
				console.error("Ошибка при инициализации auth:", e);
				setToken(null);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();
	}, []);

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
		await clearTokens();
		setToken(null);
		router.replace("/Login");

		// NavigationService.navigate("/Login");
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
