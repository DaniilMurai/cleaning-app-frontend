import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { TokenPair } from "@/api/auth";
import { removeTokens, updateTokens } from "@/core/auth/helpers";
import OnAuthChangeCallbacks from "@/core/auth/OnAuthChangeCallbacks";
import { RefreshTokenStorage } from "@/core/auth/storage";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCurrentUserQueryOptions } from "@/api/users";
import AuthContext from "@/core/auth/AuthContext";

export default function AuthProvider({ children }: PropsWithChildren) {
	const queryClient = useQueryClient();

	const [isLoaded, setIsLoaded] = useState(false);
	const [isAuthorised, setIsAuthorised] = useState(false);

	const validateToken = useCallback(async () => {
		try {
			await queryClient.ensureQueryData(getGetCurrentUserQueryOptions());
			setIsAuthorised(true);
			return true;
		} catch (error) {
			console.error("An error occurred while loading current user", error);
			await onLogout();
			return false;
		}
	}, []);

	const onLogin = useCallback(async (data: TokenPair) => {
		setIsAuthorised(true);
		await updateTokens(data);
		const isValid = await validateToken();
		if (isValid) {
			await queryClient.refetchQueries();
		}
		return isValid;
	}, []);

	const onLogout = useCallback(async () => {
		setIsAuthorised(false);
		queryClient.clear();
		return await removeTokens();
	}, []);

	useEffect(() => {
		OnAuthChangeCallbacks.onTokenRefreshed = () => setIsAuthorised(true);
		OnAuthChangeCallbacks.onTokenRefreshFailed = onLogout;
	}, [onLogout]);

	useEffect(() => {
		RefreshTokenStorage.get()
			.then(async token => {
				try {
					if (token) {
						await validateToken();
					}
				} finally {
					setIsLoaded(true);
				}
			})
			.catch(() => {
				setIsLoaded(true);
			});
	}, []);

	return (
		<AuthContext.Provider value={{ isLoaded, isAuthorised, onLogin, onLogout, validateToken }}>
			{children}
		</AuthContext.Provider>
	);
}
