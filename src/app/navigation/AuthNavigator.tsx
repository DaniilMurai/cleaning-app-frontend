// src/navigation/AuthNavigator.tsx
import React from 'react';
import {Stack} from "expo-router";


export default function AuthNavigator() {
    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
        </Stack>
    );
}
