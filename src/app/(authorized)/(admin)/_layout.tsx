import { Stack } from "expo-router";
import { useState } from "react";
import useAuth, { useUserStatus } from "@/context/AuthContext";
import { ActivityIndicator } from "react-native";

export default function AuthorizedLayout() {
	// const { token } = useAuth();
	//TODO Вернуть обратно!!!

	// if (!token) {
	// 	return <Redirect href={"/Login"} />;
	// }
	const [isAdmin, setIsAdmin] = useState(false);

	const { user, loading } = useAuth();
	const userStatus = useUserStatus();

	if (loading) return <ActivityIndicator />;

	// if (!user) return <Redirect href={"/Login"} />; //TODO вернуть и протестить
	// if (userStatus !== "active") {
	// 	router.replace("/Activate");
	// 	return null;
	// }

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
}
