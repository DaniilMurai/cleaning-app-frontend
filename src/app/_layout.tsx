import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useUnistyles } from "react-native-unistyles";

import { Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/core/context/LanguageContext";
import { EventProvider } from "react-native-outside-press";
import { PortalProvider } from "@/features/Portal";
import { AuthProvider, useAuth } from "@/core/auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ToastProvider, useToast } from "react-native-toast-notifications";
import { AlertUtils } from "@/core/utils/alerts";
import PopperContextProvider from "@/max_ui/Popper/PopperContext";
import "../max_ui/Select/select-web.css";

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
				<ToastProvider
					placement={"top"}
					duration={3000}
					animationType={"slide-in"}
					animationDuration={250}
					swipeEnabled={true}
					textStyle={{ fontSize: 16 }}
					successColor={theme.colors.success.main}
					dangerColor={theme.colors.error.main}
					warningColor={theme.colors.warning.main}
				>
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
							<InnerApp />
						</ThemeProvider>
					</LanguageProvider>
				</ToastProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

function InnerApp() {
	const toast = useToast();

	useEffect(() => {
		AlertUtils.setToast(toast);
	}, [toast]);

	return (
		<EventProvider>
			<PortalProvider>
				<PopperContextProvider>
					<Slot />
				</PopperContextProvider>
			</PortalProvider>
		</EventProvider>
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
