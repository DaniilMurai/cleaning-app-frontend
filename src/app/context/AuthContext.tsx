// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import * as SecureStore from 'expo-secure-store'; // вместо AsyncStorage
import { getTokens } from "@/hooks/tokens";

interface AuthContextValue {
	token: string | null;
	loading: boolean;
	logout: () => Promise<void>;
	checkToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<unknown>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Async IIFE, чтобы явно обрабатывать промис
		(async function bootstrap() {
			await checkToken();
		})();
	}, []);

	const checkToken = async () => {
		try {
			const tokens = await getTokens();
			if (tokens) {
				setToken(tokens.accessToken);
			}
		} catch (e) {
			console.error("Ошибка при загрузке токена:", e);
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
