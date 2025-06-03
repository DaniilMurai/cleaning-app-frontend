// src/ui/components/common/2PasswordInputs.tsx
import Input from "../../Input";
import { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { Typography } from "@/ui";
import { PasswordValidationResult } from "@/hooks/usePasswordValidation";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

export interface PasswordInputsProps {
	onValidate?: (result: PasswordValidationResult) => void;
	minLength?: number;
	statusMessages?: {
		success?: string | null;
		processing?: string | null;
		error?: string | null;
	};
	style?: any;
	placeholder1?: string;
	placeholder2?: string;
}

export interface PasswordInputsRef {
	validate: () => PasswordValidationResult;
	getPassword: () => string;
	reset: () => void;
}

const PasswordInputs = forwardRef<PasswordInputsRef, PasswordInputsProps>(
	(
		{ style, onValidate, minLength = 8, statusMessages = {}, placeholder1, placeholder2 },
		ref
	) => {
		const [newPassword, setNewPassword] = useState<string>("");
		const [repeatedPassword, setRepeatPassword] = useState<string>("");
		const [error, setError] = useState<string>("");

		const [showPassword1, setShowPassword1] = useState<boolean>(false);
		const [showPassword2, setShowPassword2] = useState<boolean>(false);

		// Вынесем логику валидации
		const validatePasswords = (): PasswordValidationResult => {
			// Сбрасываем предыдущую ошибку
			setError("");

			// Выполняем валидацию
			if (newPassword !== repeatedPassword) {
				const errorMsg = "Passwords do not match";
				setError(errorMsg);
				return { isValid: false, password: "", error: errorMsg };
			}

			if (newPassword.length < minLength) {
				const errorMsg = `Password must be at least ${minLength} characters long`;
				setError(errorMsg);
				return { isValid: false, password: "", error: errorMsg };
			}

			// Если всё в порядке
			return { isValid: true, password: newPassword, error: null };
		};

		// Экспортируем методы через ref
		useImperativeHandle(ref, () => ({
			validate: () => {
				const result = validatePasswords();
				if (onValidate) {
					onValidate(result);
				}
				return result;
			},
			getPassword: () => newPassword,
			reset: () => {
				setNewPassword("");
				setRepeatPassword("");
				setError("");
			},
		}));

		return (
			<>
				<View>
					<Input
						placeholder={placeholder1 ? placeholder1 : "new password"}
						value={newPassword}
						onChangeText={text => setNewPassword(text)}
						style={styles.input}
						secureTextEntry={!showPassword1}
					/>
					<View style={styles.passwordContainer}>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowPassword1(!showPassword1)}
						>
							<FontAwesome5
								name={showPassword1 ? "eye-slash" : "eye"}
								size={20}
								color="gray"
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View>
					<Input
						placeholder={placeholder2 ? placeholder2 : "confirm password"}
						value={repeatedPassword}
						onChangeText={text => setRepeatPassword(text)}
						style={styles.input}
						secureTextEntry={!showPassword2}
					/>
					<View style={styles.passwordContainer}>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowPassword2(!showPassword2)}
						>
							<FontAwesome5
								name={showPassword2 ? "eye-slash" : "eye"}
								size={20}
								color="gray"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{error ? (
					<Typography style={[styles.text, styles.errorText]}>{error}</Typography>
				) : null}

				{statusMessages.error && !error ? (
					<Typography style={[styles.text, styles.errorText]}>
						{statusMessages.error}
					</Typography>
				) : null}

				{statusMessages.success ? (
					<Typography style={[styles.text, styles.successText]}>
						{statusMessages.success}
					</Typography>
				) : null}

				{statusMessages.processing ? (
					<Typography style={styles.text}>{statusMessages.processing}</Typography>
				) : null}
			</>
		);
	}
);

export default PasswordInputs;

const styles = StyleSheet.create(theme => ({
	input: {
		marginBottom: theme.spacing(0.5),
	},
	text: {
		marginVertical: theme.spacing(0.5),
	},
	errorText: {
		color: theme.colors.error.main,
	},
	successText: {
		color: theme.colors.success.main,
	},
	passwordContainer: {
		flexDirection: "row-reverse",
	},
	eyeIcon: {
		position: "absolute",
		right: theme.spacing(1),
		top: -theme.spacing(5.5),
		padding: theme.spacing(1),
	},
}));
