// src/ui/components/common/LanguageSwitcher.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
	const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

	return (
		<View style={styles.container}>
			{availableLanguages.map(lang => (
				<TouchableOpacity
					key={lang.code}
					style={[
						styles.languageButton,
						currentLanguage === lang.code && styles.activeLanguage,
					]}
					onPress={() => changeLanguage(lang.code)}
				>
					<Typography
						variant="body2"
						style={currentLanguage === lang.code ? styles.activeText : styles.text}
					>
						{lang.code.toUpperCase()}
					</Typography>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create(theme => ({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	languageButton: {
		paddingHorizontal: theme.spacing(1),
		paddingVertical: theme.spacing(0.5),
		marginHorizontal: theme.spacing(0.5),
		borderRadius: theme.spacing(1),
	},
	activeLanguage: {
		backgroundColor: theme.colors.primary.main,
	},
	activeText: {
		color: theme.colors.text.primary,
	},
	text: {
		color: theme.colors.text.secondary,
	},
}));

export default LanguageSwitcher;
