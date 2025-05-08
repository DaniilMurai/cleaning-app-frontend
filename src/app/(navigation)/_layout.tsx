// src/(navigation)/RootNavigator.tsx
import React from "react";
import useAuth from "@/context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

// type Tokens = {
// 	accessToken: string | null;
// 	refreshToken: string | null;
// };

export default function RootNavigator() {
	const { token, loading } = useAuth();

	// useEffect(() => {
	// 	const bootstrap = async () => {
	// 		const tokens: Tokens = await getTokens();
	// 		if (tokens.accessToken) {
	// 			const response = await getCurrentUser();
	// 			console.log(response);
	// 			setToken(tokens.accessToken);
	// 		} else {
	// 			console.log("no token");
	// 			setToken(null);
	// 			await logout();
	// 		}
	// 		setChecking(false);
	// 	};
	// 	bootstrap();
	// }, []);

	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<Stack>
			{token ? <Stack.Screen name="(authorized)" /> : <Stack.Screen name="(auth)" />}
		</Stack>
	);
	// return <Stack></Stack>;
}
