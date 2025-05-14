// (auth)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import ThemeSwitcher from "@/ui/components/common/ThemeSwitcher";

// Обязательный default export
export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<View style={{ marginRight: 10 }}>
						<ThemeSwitcher />
					</View>
				),
			}}
		>
			<Stack.Screen name="activate" />
			<Stack.Screen name="Login" />
		</Stack>
	);
}
