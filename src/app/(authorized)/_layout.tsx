import {Stack} from "expo-router";


export default function AuthorizedLayout() {


    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
    )
}