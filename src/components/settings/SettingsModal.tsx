// src/ui/components/settings/SettingsModal.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { Button, ModalContainer } from "@/ui";
import Typography from "@/ui/common/Typography";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/core/context/LanguageContext";
import CustomPicker from "@/ui/common/Picker";

interface SettingsModalProps {
	isVisible: boolean;
	onClose: () => void;
	// onChangePassword: () => void; // Новый пропс
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

	return (
		<ModalContainer visible={isVisible} onClose={onClose}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Typography variant="h5" style={styles.title}>
						{t("settings.title") || "Settings"}
					</Typography>
					<TouchableOpacity onPress={onClose} style={styles.closeButton}>
						<FontAwesome5 name="times" size={20} color={styles.iconColor.color} />
					</TouchableOpacity>
				</View>

				<View style={styles.content}>
					{/* Theme Section */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Typography variant="h6" style={styles.sectionTitle}>
								{t("settings.theme") || "Theme"}
							</Typography>
						</View>

						<View style={styles.themeSelector}>
							<TouchableOpacity
								style={[
									styles.themeOption,
									UnistylesRuntime.themeName === "light" &&
										styles.activeThemeOption,
								]}
								onPress={() => {
									UnistylesRuntime.setAdaptiveThemes(false);
									UnistylesRuntime.setTheme("light");
								}}
							>
								<FontAwesome5
									name="sun"
									size={16}
									color={
										UnistylesRuntime.themeName === "light"
											? styles.activeThemeIcon.color
											: styles.themeIcon.color
									}
								/>
								<Typography
									style={[
										styles.optionText,
										UnistylesRuntime.themeName === "light" &&
											styles.activeOptionText,
									]}
								>
									{t("settings.lightTheme") || "Light"}
								</Typography>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.themeOption,
									UnistylesRuntime.themeName === "dark" &&
										styles.activeThemeOption,
								]}
								onPress={() => {
									UnistylesRuntime.setAdaptiveThemes(false);
									UnistylesRuntime.setTheme("dark");
								}}
							>
								<FontAwesome5
									name="moon"
									size={16}
									color={
										UnistylesRuntime.themeName === "dark"
											? styles.activeThemeIcon.color
											: styles.themeIcon.color
									}
								/>
								<Typography
									style={[
										styles.optionText,
										UnistylesRuntime.themeName === "dark" &&
											styles.activeOptionText,
									]}
								>
									{t("settings.darkTheme") || "Dark"}
								</Typography>
							</TouchableOpacity>
						</View>
					</View>
					{/* Language Section */}
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<Typography variant="h6" style={styles.sectionTitle}>
								{t("settings.language") || "Language"}
							</Typography>
						</View>
						<CustomPicker
							value={currentLanguage ?? t("settings.language")}
							options={availableLanguages.map(lang => ({
								label: lang.name,
								value: lang.code,
							}))}
							onChange={value => changeLanguage(value)}
						/>
					</View>
				</View>

				<Button variant="contained" onPress={onClose} style={styles.doneButton}>
					{t("common.save") || "Done"}
				</Button>
			</View>
		</ModalContainer>
	);
};

const styles = StyleSheet.create(theme => ({
	container: {
		width: "100%",
		maxWidth: 450,
		backgroundColor: theme.colors.background.paper,
		borderRadius: theme.borderRadius(3),
		overflow: "hidden", // Важно: меняем hidden на visible!
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
		alignSelf: "center",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: theme.colors.primary.main,
		paddingHorizontal: theme.spacing(3),
		paddingVertical: theme.spacing(2),
	},
	title: {
		color: theme.colors.primary.text,
		fontWeight: "bold",
	},
	closeButton: {
		padding: theme.spacing(1),
		borderRadius: theme.borderRadius(5),
	},
	iconColor: {
		color: theme.colors.primary.text,
	},
	content: {
		padding: theme.spacing(3),
	},
	section: {
		position: "relative", // Создаем новый контекст наложения
		zIndex: 1, // Базовый уровень
		marginBottom: theme.spacing(4),
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: theme.spacing(2),
	},
	sectionIcon: {
		color: theme.colors.primary.main,
		marginRight: theme.spacing(1),
	},
	sectionTitle: {
		fontWeight: "bold",
		color: theme.colors.text.primary,
	},
	themeSelector: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	themeOption: {
		flexDirection: "row",
		alignItems: "center",
		padding: theme.spacing(2),
		backgroundColor: theme.colors.background.default,
		borderRadius: theme.borderRadius(2),
		flex: 1,
		marginHorizontal: theme.spacing(1),
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	activeThemeOption: {
		backgroundColor: theme.colors.primary.main,
		borderColor: theme.colors.primary.main,
	},
	themeIcon: {
		color: theme.colors.text.secondary,
	},
	activeThemeIcon: {
		color: theme.colors.primary.text,
	},
	optionText: {
		marginLeft: theme.spacing(1.5),
		color: theme.colors.text.secondary,
	},
	activeOptionText: {
		color: theme.colors.primary.text,
	},
	languageSelector: {
		borderWidth: 1,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius(2),
		backgroundColor: theme.colors.background.default,
		overflow: "hidden",
	},
	picker: {
		color: theme.colors.text.primary,
		height: 50,
	},
	doneButton: {
		alignSelf: "center",
		paddingHorizontal: theme.spacing(4),
		marginBottom: theme.spacing(3),
		zIndex: -1,
		borderRadius: theme.borderRadius(3),
		backgroundColor: theme.colors.primary.main,
	},
	changePasswordButton: {
		maxWidth: 180,
	},
	buttonsContainer: {
		flexWrap: "wrap",
		flexDirection: "row",
		gap: theme.spacing(2),
	},
}));

export default SettingsModal;
