// src/(navigation)/RootNavigator.tsx
import React from "react";
import useAuth from "@/core/context/AuthContext";
import { Stack } from "expo-router";
import Loading from "@/ui/common/Loading";

export default function RootNavigator() {
	const { token, loading } = useAuth();

	if (loading) return <Loading />;
	console.log("Token in root navigator: " + token);

	return (
		<Stack>
			{token ? <Stack.Screen name="(authorized)" /> : <Stack.Screen name="(auth)" />}
		</Stack>
	);
}
