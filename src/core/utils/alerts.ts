import { Alert, Platform, StyleProp, ViewStyle } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { StyleSheet } from "react-native-unistyles";

export type ToastType = "success" | "error" | "warning" | "info" | "normal";

export interface ToastOptions {
	type?: ToastType;
	duration?: number;
	placement?: "top" | "bottom" | "center";
	animationType?: "slide-in" | "zoom-in";
	swipeEnabled?: boolean;
}

let toastRef: ReturnType<typeof useToast> | null = null;

export const AlertUtils = {
	/**
	 * Инициализация Toast
	 */
	setToast: (toast: ReturnType<typeof useToast>) => {
		toastRef = toast;
	},

	/**
	 * Базовый метод для показа сообщений
	 */
	showMessage: (message: string, options?: ToastOptions) => {
		if (!toastRef) {
			console.warn("Toast не инициализирован. Используйте AlertUtils.setToast()");
			return;
		}

		const defaultOptions: ToastOptions = {
			type: "normal",
			duration: 4000,
			placement: "top",
			animationType: "zoom-in",
			swipeEnabled: true,
		};

		const finalOptions = { ...defaultOptions, ...options };

		const toastStyle: StyleProp<ViewStyle> = getToastStyle(finalOptions.type ?? "normal");

		toastRef.show(message, {
			type: finalOptions.type,
			duration: finalOptions.duration,
			placement: finalOptions.placement,
			animationType: finalOptions.animationType,
			swipeEnabled: finalOptions.swipeEnabled,
			style: toastStyle,
			textStyle: getTextStyle(finalOptions.type ?? "normal"),
		});
	},

	/**
	 * Показывает сообщение об успехе
	 */
	showSuccess: (message: string, duration?: number) => {
		AlertUtils.showMessage(message, {
			type: "success",
			duration: duration || 3000,
		});
	},

	/**
	 * Показывает сообщение об ошибке
	 */
	showError: (error: Error | string, duration?: number) => {
		const errorMessage =
			typeof error === "string" ? error : error.message || "Произошла ошибка";

		AlertUtils.showMessage(errorMessage, {
			type: "error",
			duration: duration || 5000,
		});
	},

	/**
	 * Показывает предупреждение
	 */
	showWarning: (message: string, duration?: number) => {
		AlertUtils.showMessage(message, {
			type: "warning",
			duration: duration || 4000,
		});
	},

	/**
	 * Показывает информационное сообщение
	 */
	showInfo: (message: string, duration?: number) => {
		AlertUtils.showMessage(message, {
			type: "info",
			duration: duration || 4000,
		});
	},

	/**
	 * Показывает кастомное сообщение
	 */
	showCustom: (message: string, options: ToastOptions) => {
		AlertUtils.showMessage(message, options);
	},

	/**
	 * Скрывает все активные Toast
	 */
	hideAll: () => {
		toastRef?.hideAll?.();
	},

	/**
	 * Показывает диалог подтверждения
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
					text: "Отмена",
					style: "cancel",
					onPress: onCancel,
				},
				{
					text: "Подтвердить",
					style: "destructive",
					onPress: onConfirm,
				},
			]);
		}
	},
};

// Создаем стили с использованием unistyles
const styles = StyleSheet.create(theme => ({
	baseToast: {
		borderRadius: theme.borderRadius(3),
		paddingHorizontal: theme.spacing(2),
		paddingVertical: theme.spacing(1.5),
		marginHorizontal: theme.spacing(2),
		...theme.shadow(3),
	},
	successToast: {
		backgroundColor: theme.colors.success.main,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.success.dark,
	},
	errorToast: {
		backgroundColor: theme.colors.error.main,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.error.dark,
	},
	warningToast: {
		backgroundColor: theme.colors.warning.main,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.warning.dark,
	},
	infoToast: {
		backgroundColor: theme.colors.info.main,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.info.dark,
	},
	normalToast: {
		backgroundColor: theme.colors.background.paper,
		borderLeftWidth: 4,
		borderLeftColor: theme.colors.primary.main,
		borderWidth: 1,
		borderColor: theme.colors.border,
	},
	successText: {
		color: theme.colors.success.text,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
	},
	errorText: {
		color: theme.colors.error.text,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
	},
	warningText: {
		color: theme.colors.warning.text,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
	},
	infoText: {
		color: theme.colors.info.text,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
	},
	normalText: {
		color: theme.colors.text.primary,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
	},
}));

/**
 * Получает стиль Toast в зависимости от типа
 * В Unistyles 3.0 используем array syntax вместо спредирования
 */
const getToastStyle = (type: ToastType) => {
	switch (type) {
		case "success":
			return [styles.baseToast, styles.successToast];
		case "error":
			return [styles.baseToast, styles.errorToast];
		case "warning":
			return [styles.baseToast, styles.warningToast];
		case "info":
			return [styles.baseToast, styles.infoToast];
		default:
			return [styles.baseToast, styles.normalToast];
	}
};

/**
 * Получает стиль текста в зависимости от типа
 */
const getTextStyle = (type: ToastType) => {
	switch (type) {
		case "success":
			return styles.successText;
		case "error":
			return styles.errorText;
		case "warning":
			return styles.warningText;
		case "info":
			return styles.infoText;
		default:
			return styles.normalText;
	}
};
