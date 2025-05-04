import {StyleSheet} from 'react-native-unistyles';
// Определение тем
export const themes = {
    light: {
        colors: {
            text: '#1A353C',
            background: '#F5FCFF',
            tint: '#4ECDC4',
            icon: '#1A535C',
            tabIconDefault: '#1A535C',
            tabIconSelected: '#4ECDC4',
            accent: '#FF6B6B',
        },
        metrics: {
            borderRadius: 8,
        },
        fonts: {
            primary: 'Inter',
        }
    },
    dark: {
        colors: {
            text: '#ECEDEE',
            background: '#151718',
            tint: '#1A535C',
            icon: '#9BA1A6',
            tabIconDefault: '#9BA1A6',
            tabIconSelected: '#1A535C',
            accent: '#FF6B6B',
        },
        metrics: {
            borderRadius: 8,
        },
        fonts: {
            primary: 'Inter',
        }
    },
} as const;

// Типизация для TypeScript
declare module 'react-native-unistyles' {
    export interface UnistylesThemes {
        light: typeof themes.light,
        dark: typeof themes.dark
    }
}

// Конфигурация Unistyles
StyleSheet.configure({
    themes: {
        light: themes.light,
        dark: themes.dark
    },
    settings: {
        adaptiveThemes: true // Автоматическое переключение тем
    }
});

// Функция-хелпер для типизации стилей
const styled = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
    },
    button: {
        backgroundColor: theme.colors.tint,
        borderRadius: theme.metrics.borderRadius,
        padding: 16,
        alignItems: 'center',
    },
    text: {
        color: theme.colors.text,
        fontFamily: theme.fonts.primary,
    },
    input: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.icon,
        borderWidth: 1,
        borderRadius: theme.metrics.borderRadius,
        padding: 12,
        color: theme.colors.text,
        fontFamily: theme.fonts.primary,
    },
}));

export const stylesheet = styled;