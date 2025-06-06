import { PasswordValidationResult } from "@/core/hooks/auth/usePasswordValidation";
import { forwardRef, useImperativeHandle, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Input from "../../common/Input";
import { FontAwesome5 } from "@expo/vector-icons";
import { Typography } from "@/ui";
import { StyleSheet } from "react-native-unistyles";

export interface PasswordInputsProps {
	onValidate?: (result: PasswordValidationResult) => void;
	minLength?: number;
	statusMessages?: {
		success?: string | null;
		processing?: string | null;
		error?: string | null;
	};
	style?: any;
	placeholder?: string;
}

export interface PasswordInputsRef {
	validate: () => PasswordValidationResult;
	getPassword: () => string;
	reset: () => void;
}

const PasswordInput = forwardRef<PasswordInputsRef, PasswordInputsProps>(
	({ style, onValidate, minLength = 8, statusMessages = {}, placeholder }, ref) => {
		const [password, setPassword] = useState<string>("");
		const [showPassword, setShowPassword] = useState<boolean>(false);

		const [error, setError] = useState<string>("");

		const ValidatePassword = (): PasswordValidationResult => {
			setError("");

			if (password.length < minLength) {
				const errorMsg = `Password must be at least ${minLength} characters long`;
				setError(errorMsg);
				return { isValid: false, error: errorMsg, password: "" };
			}

			return { isValid: true, error: null, password: password };
		};

		useImperativeHandle(ref, () => ({
			validate: () => {
				const result = ValidatePassword();
				if (onValidate) onValidate(result);
				return result;
			},
			getPassword: () => password,
			reset: () => {
				setPassword("");
				setError("");
			},
		}));

		return (
			<>
				<View>
					<Input
						placeholder={placeholder ? placeholder : "password"}
						value={password}
						onChangeText={text => setPassword(text)}
						style={styles.input}
						secureTextEntry={!showPassword}
					/>
					<View style={styles.passwordContainer}>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowPassword(!showPassword)}
						>
							<FontAwesome5
								name={showPassword ? "eye-slash" : "eye"}
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

export default PasswordInput;

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
