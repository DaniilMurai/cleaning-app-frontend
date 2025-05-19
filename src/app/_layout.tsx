import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useUnistyles } from "react-native-unistyles";

import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/context/LanguageContext";
import { EventProvider } from "react-native-outside-press";
import { PortalProvider } from "@/features/Portal";
import PopperContextProvider from "@/ui/Popper/PopperContext";

export default function RootLayout() {
	const { theme, rt } = useUnistyles();
	const queryClient = new QueryClient();

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
					<EventProvider>
						<PortalProvider>
							<PopperContextProvider>
								<RootLayoutNav />
							</PopperContextProvider>
						</PortalProvider>
					</EventProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

function RootLayoutNav() {
	return (
		<LanguageProvider>
			<Stack initialRouteName="(navigation)" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(navigation)" options={{ headerShown: false }} />
			</Stack>
		</LanguageProvider>
	);
}
