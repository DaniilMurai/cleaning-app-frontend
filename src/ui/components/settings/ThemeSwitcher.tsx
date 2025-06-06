import React from "react";
import { View } from "react-native";
import { Button } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";

import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

export default function ThemeSwitcher() {
	return (
		<View style={styles.container}>
			<Button
				variant="outlined"
				onPress={() => {
					UnistylesRuntime.setAdaptiveThemes(false);
					UnistylesRuntime.setTheme("light");
				}}
				style={[
					styles.button,
					UnistylesRuntime.themeName === "light" && styles.buttonActive,
				]}
			>
				<FontAwesome5 name="sun" size={20} style={styles.icon} />
			</Button>

			<Button
				variant="outlined"
				onPress={() => {
					UnistylesRuntime.setAdaptiveThemes(false);
					UnistylesRuntime.setTheme("dark");
				}}
				style={[
					styles.button,
					UnistylesRuntime.themeName === "dark" && styles.buttonActive,
				]}
			>
				<FontAwesome5
					name="moon"
					size={20}
					style={[
						styles.icon,
						UnistylesRuntime.themeName === "dark" && styles.iconActive,
					]}
				/>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flexDirection: "row",
	},
	button: {
		marginHorizontal: 3,
		minWidth: 40,
	},
	icon: {
		color: theme.colors.text.secondary,
	},
	iconActive: {
		color: theme.colors.primary.main,
	},
	buttonActive: {
		borderColor: theme.colors.primary.main,
	},
}));
