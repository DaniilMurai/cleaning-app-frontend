import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useUnistyles } from "react-native-unistyles";

import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/core/context/LanguageContext";
import { EventProvider } from "react-native-outside-press";
import { PortalProvider } from "@/features/Portal";
import PopperContextProvider from "@/ui/components/Popper/PopperContext";
import { AuthProvider, useAuth } from "@/core/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

export default function RootLayout() {
	const { theme, rt } = useUnistyles();
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<LanguageProvider>
					<HideSplash />
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
									<Slot />
								</PopperContextProvider>
							</PortalProvider>
						</EventProvider>
					</ThemeProvider>
				</LanguageProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

function HideSplash() {
	const { isLoaded } = useAuth();

	useEffect(() => {
		if (isLoaded) {
			SplashScreen.hideAsync();
		}
	}, [isLoaded]);

	return null;
}
