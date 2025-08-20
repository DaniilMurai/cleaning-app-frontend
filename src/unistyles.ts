import { StyleSheet } from "react-native-unistyles";
import { Platform } from "react-native";

const themedColors = {
	light: {
		primary: {
			main: "#0D9488", // teal-600 — более солидный и контрастный
			light: "#2DD4BF", // teal-400 — светлее, но still fresh
			dark: "#0F766E", // teal-700 — оставляем, хороший тёмный оттенок
			text: "#FFFFFF",
			contrastText: "#FFFFFF",
			mainOpacity: "#0D94881A", // Обновлён под новый main
		},
		secondary: {
			main: "#EC4899", // pink-500 — современнее и мягче, чем красный
			light: "#FBCFE8", // pink-200
			dark: "#BE185D", // pink-700
			text: "#000",
			background: "#FDF2F8", // pink-50 — очень светлый розовый для фона
		},
		info: {
			main: "#0369A1", // sky-700 — более глубокий и доверительный синий
			light: "#BAE6FD", // sky-200
			dark: "#0C4A6E", // sky-900
			text: "#000",
		},
		warning: {
			main: "#D97706", // amber-600 — менее "кислотный"
			light: "#FDE68A", // amber-200
			dark: "#92400E", // amber-800
			text: "#000", // Сменил на чёрный, лучше читается на светлом жёлтом
			background: "#FFFBEB", // amber-50
		},
		error: {
			main: "#DC2626", // red-600 — классическая ошибка, но чуть приглушённее
			light: "#FECACA", // red-200
			dark: "#7F1D1D", // red-800
			text: "#fff",
			background: "#FEF2F2", // red-50
		},
		success: {
			main: "#059669", // emerald-600 — более спокойный и естественный зелёный
			light: "#A7F3D0", // emerald-200
			dark: "#065F46", // emerald-800
			text: "#fff",
			textOnBackground: "#065F46", // Используем dark оттенок
			background: "#ECFDF5", // emerald-50
		},
		progress: {
			main: "#2563EB", // blue-600 — оставляем, хороший
			background: "#DBEAFE", // blue-100 — светлее, соответствует новой схеме
		},
		not_started: {
			main: "#9CA3AF", // gray-400 — светлее, чтобы лучше контрастировал с активными статусами
			background: "#F3F4F6", // gray-100 — оставляем
		},
		background: {
			main: "#F9FAFB", // gray-50 — отличный выбор, оставляем
			paper: "#FFFFFF",
			default: "#FFFFFF",
			modal: "#FFFFFFF2", // Полупрозрачный белый для модалок — хорошо
		},
		text: {
			primary: "#111827", // gray-900 — идеально, оставляем
			secondary: "#4B5563", // gray-600 — чуть светлее, чем было, для вторичного текста
			disabled: "#9CA3AF", // gray-400 — явный цвет вместо прозрачности, лучше для доступности
		},
		skeleton: {
			background: "#E5E7EB", // gray-200 — хорошо
			foreground: "#F3F4F6", // gray-100 — хорошо
		},
		components: {
			input: {
				background: "#FFFFFF",
				border: "#D1D5DB", // gray-300 — хорошо
				outline: "#0D9488", // Обновлён под новый primary.main
			},
		},
		divider: "rgba(0, 0, 0, 0.06)", // Ещё более нежная линия
		shadow: "rgba(0, 0, 0, 0.05)", // Более лёгкая и воздушная тень
		border: "#E5E7EB", // gray-200 — хорошо
		disabled: {
			background: "rgba(0, 0, 0, 0.04)", // Ещё более прозрачный
			text: "#9CA3AF", // Синхронизировал с text.disabled
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
			main: "#b24040",
			light: "#a46a6a",
			dark: "#592929",
			text: "#fff",
			background: "#834a4a1a",
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
			modal: "#272a2cF2", // почти как paper, но с прозрачностью
		},
		text: {
			primary: "#ECEDEE",
			secondary: "#999a9a",
			disabled: "rgba(255, 255, 255, 0.38)", // Add this line
		},
		skeleton: {
			background: "#2d3032", // светлее, чем background.paper
			foreground: "#3a3e41", // чуть светлее background, создаёт shimmer
		},
		components: {
			input: {
				background: "#1a1c1d", // тёмный, но не чёрный, для полей ввода
				border: "#3f4447", // серо-графитовый
				outline: "#38a29d", // твой primary.main
			},
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

const breakpoints = {
	xs: 0,
	sm: 576,
	md: 740,
	lg: 992,
	xl: 1200,
	xxl: 1400,
} as const;

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
		shadow: (elevation: number, color = "#000000") => {
			if (!elevation) {
				return {
					elevation: 0,
					shadowOffset: {
						width: 0,
						height: 0,
					},
					shadowOpacity: 0,
					shadowRadius: 0,
					shadowColor: color,
				};
			}

			const androidDepth = {
				penumbra: [
					"0px 1px 1px 0px",
					"0px 2px 2px 0px",
					"0px 3px 4px 0px",
					"0px 4px 5px 0px",
					"0px 5px 8px 0px",
					"0px 6px 10px 0px",
					"0px 7px 10px 1px",
					"0px 8px 10px 1px",
					"0px 9px 12px 1px",
					"0px 10px 14px 1px",
					"0px 11px 15px 1px",
					"0px 12px 17px 2px",
					"0px 13px 19px 2px",
					"0px 14px 21px 2px",
					"0px 15px 22px 2px",
					"0px 16px 24px 2px",
					"0px 17px 26px 2px",
					"0px 18px 28px 2px",
					"0px 19px 29px 2px",
					"0px 20px 31px 3px",
					"0px 21px 33px 3px",
					"0px 22px 35px 3px",
					"0px 23px 36px 3px",
					"0px 24px 38px 3px",
				],
			};

			function parseShadow(raw: string) {
				const values = raw.split(" ").map(val => +val.replace("px", ""));
				return {
					x: values[0],
					y: values[1],
					blur: values[2],
					spread: values[3], // unused
				};
			}

			function interpolate(i: number, a: number, b: number, a2: number, b2: number) {
				return ((i - a) * (b2 - a2)) / (b - a) + a2;
			}

			const depthIndex = elevation - 1; // Indexing starts at 0
			const s = parseShadow(androidDepth.penumbra[depthIndex]);
			const y = s.y === 1 ? 1 : Math.floor(s.y * 0.5);

			return {
				shadowColor: color,
				shadowOffset: {
					width: s.x,
					height: y,
				},
				shadowOpacity: parseFloat(interpolate(elevation, 1, 24, 0.2, 0.3).toFixed(2)),
				shadowRadius: parseFloat(interpolate(s.blur, 1, 38, 1, 10).toFixed(2)),
				elevation: elevation || 0,
			};
		},

		breakpoints,
	};
};

export type AppBreakpoints = typeof breakpoints;
export type AppBreakpoint = keyof AppBreakpoints;

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
			Platform.OS === "web"
				? { boxShadow: shadow as any }
				: theme.shadow(Number(key), theme.colors.shadow),
		])
	)
);
