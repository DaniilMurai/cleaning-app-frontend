import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useUnistyles } from "react-native-unistyles";

import { Stack, usePathname } from "expo-router";
import { AuthProvider } from "@/app/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
	const { theme, rt } = useUnistyles();
	const queryClient = new QueryClient();

	const pathname = usePathname();
	console.log("Current route:", pathname);

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
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
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(navigation)" options={{ headerShown: false }} />
					</Stack>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
