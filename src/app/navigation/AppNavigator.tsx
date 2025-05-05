import {Stack} from "expo-router";


export default function AppNavigator() {
    return (
        <Stack>
            <Stack.Screen name="(authorized)" options={{headerShown: false}}/>
        </Stack>
    );
}
