import { StyleSheet } from "react-native-unistyles";

const themedColors = {
	light: {
		primary: {
			main: "#3bd0c7",
			light: "#65eee5",
			dark: "#338883",
			text: "#000",
			contrastText: "#ffffff", // Добавлено
			mainOpacity: "#3bd0c71a",
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
			background: "#ef8d1e1a",
		},
		error: {
			light: "#ef9a9a",
			main: "#f44336",
			dark: "#c62828",
			text: "#ffffff",
			background: "#f443361a",
		},
		success: {
			light: "#e5f6ea",
			main: "#17C13E",
			dark: "#0f9128",
			text: "#fff",
			textOnBackground: "#166534",
			background: "#BBF7D0",
		},
		progress: {
			main: "#1E40AF",
			background: "#DBEAFE",
		},
		not_started: {
			main: "#1F2937",
			background: "#f3f6f3",
		},
		background: {
			main: "#F5FCFF",
			paper: "#F5FCFF",
			default: "#FFFFFF", // Добавлено
		},
		text: {
			primary: "#1A353C",
			secondary: "#374348",
			disabled: "rgba(0, 0, 0, 0.38)", // Add this line
		},
		divider: "rgba(0, 0, 0, 0.12)",
		shadow: "rgba(0, 0, 0, 0.1)", // Добавлено
		border: "#e0e0e0", // Добавлено
		disabled: {
			background: "rgba(0, 0, 0, 0.12)",
			text: "rgba(0, 0, 0, 0.26)",
		},
	},
	dark: {
		primary: {
			main: "#38a29d",
			light: "#6ac9c0",
			dark: "#338883",
			text: "#000",
			contrastText: "#ffffff", // Добавлено
			mainOpacity: "#38a29d1a",
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
			light: "#facc15",
			main: "#fbbf24", // amber-400
			dark: "#b45309", // amber-700
			text: "#1f2937",
			background: "#fbbf241a",
		},
		error: {
			light: "#fca5a5",
			main: "#f87171", // red-400
			dark: "#b91c1c",
			text: "#ffffff",
			background: "#f871711a",
		},
		success: {
			light: "#4ade80", // green-400
			main: "#22c55e", // green-500
			dark: "#15803d", // green-700
			text: "#ffffff",
			textOnBackground: "#21C55D",
			background: "#21C55D1A", // зеленый с прозрачностью
		},
		progress: {
			main: "#3C81F6", // blue-500
			background: "#3C81F61A", // полупрозрачный navy
		},
		not_started: {
			main: "#6b7280", // gray-500
			background: "#6B72801A", // gray-700
		},
		background: {
			main: "#141617",
			paper: "#272a2c",
			default: "#212426", // Добавлено
		},
		text: {
			primary: "#ECEDEE",
			secondary: "#999a9a",
			disabled: "rgba(255, 255, 255, 0.38)", // Add this line
		},
		divider: "rgba(255, 255, 255, 0.12)",
		shadow: "rgba(0, 0, 0, 0.3)", // Добавлено
		border: "#444444", // Добавлено
		disabled: {
			background: "rgba(255, 255, 255, 0.12)",
			text: "rgba(255, 255, 255, 0.3)",
		},
	},
};

export type ThemedColorsType = typeof themedColors;
export type ColorsType = ThemedColorsType[keyof ThemedColorsType];

const buildTheme = (colors: ColorsType) => {
	return {
		colors,
		borderRadius: (q: number) => q * 4,
		spacing: (q: number) => q * 8,
		shadows: {
			0: "none",
			1: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
			2: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
			3: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
			4: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
			5: "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
			6: "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
			7: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
			8: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
			9: "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
			10: "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
			11: "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
			12: "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
			13: "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
			14: "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
			15: "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
			16: "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
			17: "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
			18: "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
			19: "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
			20: "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
			21: "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
			22: "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
			23: "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
			24: "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
		} as Record<number, string>,
	};
};

const breakpoints = {
	xs: 0,
	sm: 576,
	md: 740,
	lg: 992,
	xl: 1200,
	superLarge: 1400,
	tvLike: 2000,
} as const;

type AppBreakpoints = typeof breakpoints;

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

	export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Конфигурация Unistyles
StyleSheet.configure({
	themes,
	settings: {
		adaptiveThemes: true, // Автоматическое переключение тем
	},
	breakpoints,
});

export const SHADOWS = StyleSheet.create(theme =>
	Object.fromEntries(
		Object.entries(theme.shadows).map(([key, shadow]) => [
			key.toString(),
			{
				boxShadow: shadow,
			},
		])
	)
);
