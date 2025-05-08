// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clearTokens, getTokens } from "@/hooks/tokens";
import { router } from "expo-router";
import { useGetCurrentUser, UserSchema } from "@/api/users";

interface AuthContextValue {
	token: string | null;
	loading: boolean;
	user: UserSchema | null;
	logout: () => Promise<void>;
	checkToken: () => Promise<boolean>;
	refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserSchema | null>(null);

	const { data: userData, refetch: refetchUser } = useGetCurrentUser({
		query: {
			enabled: !!token, // Запрос будет выполняться только при наличии токена
			retry: 1,
			// onError: error => {
			// 	console.error("Error fetching user data:", error);
			// 	// Если получаем ошибку авторизации, очищаем данные
			// 	if (error?.response?.status === 401) {
			// 		logout();
			// 	}
			// },
		},
	});

	// Обновляем данные пользователя при их изменении
	useEffect(() => {
		if (userData) {
			setUser(userData);
		}
	}, [userData]);

	// Инициализация при загрузке приложения
	useEffect(() => {
		initializeAuth();
	}, []);

	const initializeAuth = async () => {
		setLoading(true);
		try {
			const tokens = await getTokens();
			if (tokens?.accessToken) {
				setToken(tokens.accessToken);
			}
		} catch (e) {
			console.error("Ошибка при инициализации auth:", e);
			setToken(null);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

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

	const refreshUserData = async () => {
		if (token) {
			await refetchUser();
		}
	};

	const handleLogout = async () => {
		await clearTokens();
		setToken(null);
		setUser(null);
		router.replace("/Login");
	};

	return (
		<AuthContext.Provider
			value={{ token, loading, user, logout: handleLogout, checkToken, refreshUserData }}
		>
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

// Вспомогательный хук для проверки роли пользователя
export function useIsAdmin() {
	const { user } = useAuth();
	return user?.role === "admin";
}

// Вспомогательный хук для проверки статуса пользователя
export function useUserStatus() {
	const { user } = useAuth();
	return user?.status;
}
