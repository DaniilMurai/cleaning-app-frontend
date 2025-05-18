// src/screens/reset-password.tsx
import { Button, Card, Typography } from "@/ui";
import { router, useLocalSearchParams } from "expo-router";
import { useForgetPassword } from "@/api/auth";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import PasswordInputs, { PasswordInputsRef } from "@/ui/components/common/2PasswordInputs";
import { View } from "react-native";
import { clearTokens, saveTokens } from "@/hooks/tokens";
import useAuth from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
	const { t } = useTranslation();
	const params = useLocalSearchParams();
	const token = typeof params.token === "string" ? params.token : params.token?.[0] || "";

	// Используем ref вместо state для управления валидацией
	const passwordInputsRef = useRef<PasswordInputsRef>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { checkToken } = useAuth();

	const ForgetPasswordMutation = useForgetPassword({
		mutation: {
			onSuccess: () => {
				console.log("success");
			},
			onError: error => {
				console.log("error", error);
				setErrorMessage("Failed to reset password. Please try again.");
			},
		},
	});

	const handleButtonClick = async () => {
		// Очищаем предыдущие ошибки
		setErrorMessage(null);

		// Используем ref для вызова валидации
		if (passwordInputsRef.current) {
			const validationResult = passwordInputsRef.current.validate();

			if (validationResult.isValid) {
				// Если валидация успешна, отправляем запрос
				const result = await ForgetPasswordMutation.mutateAsync({
					data: { password: validationResult.password, token },
				});
				console.log(result);
				if (result.access_token) {
					await clearTokens();
					await saveTokens(result.access_token, result.refresh_token);
					const isValid = await checkToken();
					if (isValid) {
						router.replace("/");
					}
				}
			}
		}
	};

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Typography variant="h5" style={styles.title}>
					{t("userList.resetPassword")}
				</Typography>

				<PasswordInputs
					placeholder1={t("auth.newPassword")}
					placeholder2={t("auth.confirmPassword")}
					ref={passwordInputsRef}
					minLength={8}
					statusMessages={{
						success: ForgetPasswordMutation.isSuccess ? t("common.success") : null,
						processing: ForgetPasswordMutation.isPending ? t("common.loading") : null,
						error: errorMessage,
					}}
				/>

				<Button
					variant={"contained"}
					onPress={handleButtonClick}
					disabled={ForgetPasswordMutation.isPending}
					style={styles.button}
				>
					{t("usersList.resetPassword")}
				</Button>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: theme.spacing(2),
	},
	button: {
		alignItems: "center",
		marginTop: theme.spacing(2),
	},
	card: {
		width: "100%",
		maxWidth: 400,
		padding: theme.spacing(3),
	},
	title: {
		textAlign: "center",
		marginBottom: theme.spacing(3),
	},
}));
