import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useUnistyles} from "react-native-unistyles";

import { Stack } from "expo-router";
import Typography from "@/ui/Typography";
import { AuthProvider } from "@/app/context/AuthContext";


export default function RootLayout() {
    const {theme, rt} = useUnistyles();





    return (

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
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="(authorized)" options={{ headerShown: false }} />
                </Stack>

            </ThemeProvider>
        </AuthProvider>
    );
}
