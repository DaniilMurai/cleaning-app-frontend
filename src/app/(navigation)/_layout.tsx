// src/(navigation)/RootNavigator.tsx
import React from "react";
import useAuth from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";

export default function RootNavigator() {
	const { token, loading } = useAuth();

	if (token) {
		console.log(token);
	} else {
		console.log("no token");
	}
	console.log(token);

	if (loading) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return <Stack>{token ? <AppNavigator /> : <AuthNavigator />}</Stack>;
}
