import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useUnistyles } from "react-native-unistyles";

export default function RootLayout() {
	const { theme, rt } = useUnistyles();

	return (
		<ThemeProvider
			value={{
				...(rt.themeName === "dark" ? DarkTheme : DefaultTheme),
				colors: {
					primary: theme.colors.primary.main,
					background: theme.colors.background.main,
					card: theme.colors.background.paper,
					text: theme.colors.text.primary,
					border: theme.colors.divider,
					notification: theme.colors.error.main,
				},
			}}
		>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			</Stack>
		</ThemeProvider>
	);
}
