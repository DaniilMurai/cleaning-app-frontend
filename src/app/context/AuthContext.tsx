// src/context/AuthContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState,} from 'react';
// import * as SecureStore from 'expo-secure-store'; // вместо AsyncStorage
import {
    activate as activateApi,
    type ActivateUserData,
    login as loginApi,
    type LoginData,
    type TokenPair,
} from '@/api/auth';

interface AuthContextValue {
	token: string | null;
	user: unknown; // пока не используем, можно уточнить тип
	loading: boolean;
	login: (loginData: LoginData ) => Promise<void>;
	activate: (activateUserData: ActivateUserData) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Async IIFE, чтобы явно обрабатывать промис
        (async function bootstrap() {
            try {
                // const saved = await SecureStore.getItemAsync('authToken');
                // if (saved) {
                //     setToken(saved);
                //     // TODO: можно здесь подгрузить данные user через API
                // }
            } catch (e) {
                console.error('Ошибка при загрузке токена:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (loginData: LoginData) => {
        const data: TokenPair = await loginApi(loginData);
        setToken(data.access_token);
        // await SecureStore.setItemAsync('authToken', data.access_token);
        // TODO: можно сразу установить setUser(data.user) если API возвращает
    };

    const activate = async (activateUserData: ActivateUserData) => {
        await activateApi(activateUserData);
        // после успешной активации, например, перенаправить на логин
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        // await SecureStore.deleteItemAsync('authToken');
    };

    return (
        <AuthContext.Provider
            value={{token, user, loading, login, activate, logout}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
