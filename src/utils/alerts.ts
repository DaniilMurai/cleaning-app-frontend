// src/utils/alerts.ts
import { Alert, Platform } from "react-native";

/**
 * Утилита для показа alert/confirm сообщений, с кроссплатформенной поддержкой web/mobile
 */
export const AlertUtils = {
	/**
	 * Показывает информационное сообщение
	 */
	showMessage: (title: string, message?: string) => {
		if (Platform.OS === "web") {
			window.alert(message ? `${title}: ${message}` : title);
		} else {
			Alert.alert(title, message);
		}
	},

	/**
	 * Показывает сообщение об успехе
	 */
	showSuccess: (message: string) => {
		AlertUtils.showMessage("Success", message);
	},

	/**
	 * Показывает сообщение об ошибке
	 */
	showError: (error: Error | string) => {
		const errorMessage =
			typeof error === "string" ? error : error.message || "An error occurred";

		AlertUtils.showMessage("Error", errorMessage);
	},

	/**
	 * Показывает диалог подтверждения с кнопками Да/Нет
	 */
	showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
		if (Platform.OS === "web") {
			const confirmed = window.confirm(`${title}\n${message}`);
			if (confirmed) {
				onConfirm();
			} else if (onCancel) {
				onCancel();
			}
		} else {
			Alert.alert(title, message, [
				{
					text: "Cancel",
					style: "cancel",
					onPress: onCancel,
				},
				{
					text: "Confirm",
					style: "destructive",
					onPress: onConfirm,
				},
			]);
		}
	},
};
