// (auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import useAuth from "@/app/context/AuthContext";

// Обязательный default export
export default function AuthLayout() {
	const { token, loading } = useAuth();

	if (loading) {
		return null; // или компонент загрузки
	}

	if (token) {
		return <Redirect href={"/"} />;
	}
	return (
		<Stack>
			<Stack.Screen name="Activate" />
			<Stack.Screen name="Login" />
		</Stack>
	);
}
