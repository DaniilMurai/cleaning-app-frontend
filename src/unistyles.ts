import { StyleSheet } from "react-native-unistyles";

const themedColors = {
	light: {
		primary: {
			main: "#3bd0c7",
			light: "#65eee5",
			dark: "#338883",
			text: "#000",
		},
		secondary: {
			main: "#FF6B6B",
			light: "#ffaaaa",
			dark: "#a83f3f",
			text: "#000",
		},
		info: {
			light: "#03a9f4",
			main: "#03a9f4",
			dark: "#01579b",
			text: "#000000",
		},
		warning: {
			light: "#e7b989",
			main: "#ef8d1e",
			dark: "#a96209",
			text: "#fff",
		},
		error: {
			light: "#ef9a9a",
			main: "#f44336",
			dark: "#c62828",
			text: "#ffffff",
		},
		success: {
			light: "#e5f6ea",
			main: "#17C13E",
			dark: "#0f9128",
			text: "#fff",
		},
		background: {
			main: "#F5FCFF",
			paper: "#F5FCFF",
		},
		text: {
			primary: "#1A353C",
			secondary: "#374348",
		},
		divider: "rgba(0, 0, 0, 0.12)",
	},
	dark: {
		primary: {
			main: "#38a29d",
			light: "#6ac9c0",
			dark: "#338883",
			text: "#000",
		},
		secondary: {
			main: "#834a4a",
			light: "#a46a6a",
			dark: "#592929",
			text: "#fff",
		},
		info: {
			light: "#03a9f4",
			main: "#03a9f4",
			dark: "#01579b",
			text: "#000000",
		},
		warning: {
			light: "#fff8e1",
			main: "#ffe57f",
			dark: "#ffc107",
			text: "#000000",
		},
		error: {
			light: "#ef9a9a",
			main: "#f44336",
			dark: "#c62828",
			text: "#ffffff",
		},
		success: {
			light: "#ECF5EF",
			main: "#6bd581",
			dark: "#12912d",
			text: "#000",
		},
		background: {
			main: "#151718",
			paper: "#292c2c",
		},
		text: {
			primary: "#ECEDEE",
			secondary: "#999a9a",
		},
		divider: "rgba(255, 255, 255, 0.12)",
	},
};

export type ThemedColorsType = typeof themedColors;
export type ColorsType = ThemedColorsType[keyof ThemedColorsType];

const buildTheme = (colors: ColorsType) => {
	return {
		colors,
		borderRadius: (q: number) => q * 4,
		spacing: (q: number) => q * 8,
	};
};

// Определение тем
export const themes = {
	light: buildTheme(themedColors.light),
	dark: buildTheme(themedColors.dark),
} as const;

export type ThemesType = typeof themes;
export type ThemeType = ThemesType[keyof ThemesType];

export type UIColor = "primary" | "secondary" | "success" | "error" | "warning" | "info";

// Типизация для TypeScript
declare module "react-native-unistyles" {
	export interface UnistylesThemes extends ThemesType {}
}

// Конфигурация Unistyles
StyleSheet.configure({
	themes,
	settings: {
		adaptiveThemes: true, // Автоматическое переключение тем
	},
});
