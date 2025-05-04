import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "@/hooks/useColorScheme";

export default function RootLayout() {
    const colorScheme = useColorScheme()


    return (

        <ThemeProvider value={colorScheme === 'dark' ? {...DarkTheme, colors: {}} : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ThemeProvider>
    )
}