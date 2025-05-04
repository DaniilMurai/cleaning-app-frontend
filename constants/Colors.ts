/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const tintColorLight = '#4ECDC4'; // turquoise (primary)
const tintColorDark = '#1A535C';  // dark teal (secondary)

export const Colors = {
    light: {
        text: '#1A353C',           // dark blue-gray (text)
        background: '#F7F9FC',     // off-white (background)
        tint: tintColorLight,       // primary color
        icon: '#1A535C',            // dark teal (secondary - for icons)
        tabIconDefault: '#1A535C',  // dark teal (unselected tabs)
        tabIconSelected: tintColorLight, // primary color (selected tabs)
        accent: '#FF6B6B',          // coral (important actions)
        borderRadius: 8,            // slightly rounded corners
        fontFamily: 'Inter',        // clean, professional font
    },
    dark: {
        text: '#ECEDEE',            // light text for dark mode
        background: '#151718',      // dark background
        tint: tintColorDark,        // dark teal (secondary)
        icon: '#9BA1A6',            // greyed icons for dark
        tabIconDefault: '#9BA1A6',  // grey for unselected
        tabIconSelected: tintColorDark, // dark teal for selected
        accent: '#FF6B6B',          // coral (important actions)
        borderRadius: 8,            // slightly rounded corners
        fontFamily: 'Inter',
    },
};
