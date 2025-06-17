// (auth)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import LanguageSwitcher from "@/components/settings/LanguageSwitcher";

// Обязательный default export
export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerRight: () => (
					<View style={{ flexDirection: "row", marginRight: 10 }}>
						{/*<ThemeSwitcher />*/}
						<LanguageSwitcher />
					</View>
				),
			}}
		>
			<Stack.Screen name="activate" />
			<Stack.Screen name="Login" />
			<Stack.Screen name="reset-password" />
		</Stack>
	);
}
