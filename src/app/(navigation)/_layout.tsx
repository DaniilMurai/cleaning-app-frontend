// src/(navigation)/RootNavigator.tsx
import React from "react";
import useAuth from "@/context/AuthContext";
import { Stack } from "expo-router";
import Loading from "@/ui/Loading";

export default function RootNavigator() {
	const { token, loading } = useAuth();

	if (loading) return <Loading />;

	return (
		<Stack>
			{token ? <Stack.Screen name="(authorized)" /> : <Stack.Screen name="(auth)" />}
		</Stack>
	);
}
