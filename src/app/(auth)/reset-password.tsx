// src/screens/reset-password.tsx
import { Button, Card, Typography } from "@/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForgetPassword } from "@/api/auth";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import PasswordInputs, { PasswordInputsRef } from "@/components/passwords/2PasswordInputs";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/auth";

export default function ResetPassword() {
	const router = useRouter();

	const { t } = useTranslation();
	const params = useLocalSearchParams();
	const token = typeof params.token === "string" ? params.token : params.token?.[0] || "";

	// Используем ref вместо state для управления валидацией
	const passwordInputsRef = useRef<PasswordInputsRef>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { onLogin } = useAuth();

	const forgetPasswordMutation = useForgetPassword({
		mutation: {
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
				const result = await forgetPasswordMutation.mutateAsync({
					data: { password: validationResult.password, token },
				});
				const isValid = await onLogin(result);
				if (isValid) {
					router.replace("/");
				}
			}
		}
	};

	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Typography variant="h5" style={styles.title}>
					{t("components.userList.resetPassword")}
				</Typography>

				<PasswordInputs
					placeholder1={t("auth.newPassword")}
					placeholder2={t("auth.confirmPassword")}
					ref={passwordInputsRef}
					minLength={8}
				/>

				{!!(
					errorMessage ||
					forgetPasswordMutation.isSuccess ||
					forgetPasswordMutation.isPending
				) && (
					<Typography
						style={styles.statusMessage}
						color={
							errorMessage
								? "error"
								: forgetPasswordMutation.isSuccess
									? "success"
									: "text.primary"
						}
					>
						{errorMessage
							? errorMessage
							: forgetPasswordMutation.isSuccess
								? t("common.success")
								: t("common.loading")}
					</Typography>
				)}

				<Button
					variant={"contained"}
					onPress={handleButtonClick}
					disabled={forgetPasswordMutation.isPending}
					style={styles.button}
				>
					{t("components.usersList.resetPassword")}
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
	statusMessage: {
		marginVertical: theme.spacing(0.5),
	},
}));
