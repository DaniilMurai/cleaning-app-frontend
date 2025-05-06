import { Redirect, Stack } from "expo-router";
import useAuth from "@/app/context/AuthContext";

export default function AuthorizedLayout() {
	const { token } = useAuth();

	if (!token) {
		return <Redirect href={"/Login"} />;
	}

	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Stack>
	);
}
