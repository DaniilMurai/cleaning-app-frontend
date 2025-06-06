// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clearTokens, getTokens } from "@/core/hooks/shared/tokens";
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
		console.log("User data updated:", userData);
		if (userData) {
			setUser(userData);
		}
	}, [userData]);

	// Инициализация при загрузке приложения
	useEffect(() => {
		console.log("Initializing auth...");
		setLoading(true);
		const initAuth = async () => {
			try {
				const tokens = await getTokens();
				if (tokens?.accessToken) {
					setToken(tokens.accessToken);
					console.log("Token in init auth:", tokens.accessToken);
					console.log("Token in init auth context:", token);
					// Используем переменную newToken вместо token из состояния,
					// так как состояние еще не обновилось
					await refreshUserData(tokens.accessToken);
				} else {
					// Явно устанавливаем null, если токен не найден
					setToken(null);
					setUser(null);
				}
			} catch (e) {
				console.error("Ошибка при инициализации auth:", e);
				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	const checkToken = async () => {
		setLoading(true);
		try {
			const tokens = await getTokens();
			console.log("Token:", tokens.accessToken, "Current token:", token);
			if (tokens?.accessToken && tokens.accessToken !== token) {
				const newToken = tokens.accessToken;
				setToken(newToken);
				console.log("Token updated:", token);
				await refreshUserData(newToken);
				return true;
			}
			return !!tokens?.accessToken;
		} catch (e) {
			console.error("Ошибка при загрузке токена:", e);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const refreshUserData = async (access_token?: string) => {
		const tokenToUse = access_token || token;
		if (!tokenToUse) {
			console.error("Token is missing in refreshUserData");
			return;
		}

		try {
			const result = await refetchUser();
			// Используем результат напрямую вместо полагания на userData
			if (result.data) {
				setUser(result.data);
				console.log("User data updated:", result.data);
			}
		} catch (error) {
			console.error("Error refreshing user data:", error);
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
export function useIsAdmin(): boolean {
	const { user } = useAuth();
	console.log("user:", user);
	return user?.role === "admin" || user?.role === "superadmin";
}

export function useIsSuperAdmin(): boolean {
	const { user } = useAuth();
	console.log("user:", user);
	return user?.role === "superadmin";
}

// Вспомогательный хук для проверки статуса пользователя
export function useUserStatus() {
	const { user } = useAuth();
	return user?.status;
}
