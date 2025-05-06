// (auth)/_layout.tsx
import { Stack } from "expo-router";

// Обязательный default export
export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen name="Activate" />
			<Stack.Screen name="Login" />
		</Stack>
	);
}
