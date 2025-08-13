// src/utils/alerts.ts
import { Alert, Platform } from "react-native";
import { useToast } from "react-native-toast-notifications";

/**
 * Утилита для показа alert/confirm сообщений, с кроссплатформенной поддержкой web/mobile
 */
let toastRef: ReturnType<typeof useToast> | null = null;
export const AlertUtils = {
	/**
	 * Показывает информационное сообщение
	 */

	setToast: (toast: ReturnType<typeof useToast>) => {
		toastRef = toast;
	},
	showMessage: (title: string, message?: string) => {
		// if (Platform.OS === "web") {
		// 	window.alert(message ? `${title}: ${message}` : title);
		// } else {
		// 	Alert.alert(title, message);
		// }
		toastRef?.show(message ? `${title}: ${message}` : title);
	},

	/**
	 * Показывает сообщение об успехе
	 */
	showSuccess: (message: string) => {
		// AlertUtils.showMessage("Success", message);
		toastRef?.show("Success" + message, { type: "success" });
	},

	/**
	 * Показывает сообщение об ошибке
	 */
	showError: (error: Error | string) => {
		const errorMessage =
			typeof error === "string" ? error : error.message || "An error occurred";

		// AlertUtils.showMessage("Error", errorMessage);
		toastRef?.show("Error" + errorMessage, { type: "danger" });
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
