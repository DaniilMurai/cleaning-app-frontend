import { View } from "react-native";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";
import Input from "@/ui/common/Input";
import React, { useRef, useState } from "react";
import { Button } from "@/ui";
import { useActivate } from "@/api/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import PasswordInputs, { PasswordInputsRef } from "@/components/passwords/2PasswordInputs";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/core/auth";

export default function Activate() {
	const { t } = useTranslation();
	const [nickname, setNickname] = useState("");
	const activateMutation = useActivate();
	const params = useLocalSearchParams();
	const token = params.token;

	const passwordInputsRef = useRef<PasswordInputsRef>(null);

	const { onLogin } = useAuth();

	const router = useRouter();

	const handleActivate = async () => {
		// Очищаем предыдущие ошибки
		if (!token) {
			console.error("Token is missing");
			return;
		}

		try {
			// Используем ref для вызова валидации
			if (passwordInputsRef.current) {
				const validationResult = passwordInputsRef.current.validate();

				if (validationResult.isValid) {
					// Если валидация успешна, отправляем запрос
					const result = await activateMutation.mutateAsync({
						data: {
							nickname: nickname,
							password: validationResult.password,
							token: String(token),
						},
					});
					const isValid = await onLogin(result);
					if (isValid) {
						router.replace("/");
					}
				}
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Card variant="outlined" size="medium" style={{ width: "100%", maxWidth: 400 }}>
				<Typography variant={"h5"} style={{ textAlign: "center" }}>
					{t("auth.activateAccount")}
				</Typography>
				<Input
					placeholder={t("profile.username")}
					variant="outlined"
					color="primary"
					size="medium"
					style={styles.input}
					value={nickname}
					onChangeText={setNickname}
				/>

				<PasswordInputs
					placeholder1={t("auth.password")}
					placeholder2={t("auth.confirmPassword")}
					minLength={8}
					ref={passwordInputsRef}
				/>

				{activateMutation.isError && (
					<Typography variant="body2" color="error">
						{String(activateMutation.failureReason?.response?.data.detail) ||
							t("common.error")}
					</Typography>
				)}

				<Button
					variant="contained"
					size="medium"
					loading={activateMutation.isPending}
					disabled={!nickname || !token}
					onPress={handleActivate}
					style={{ alignItems: "center" }}
				>
					{t("auth.activate")}
				</Button>
			</Card>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	input: {
		marginBottom: theme.spacing(0.5),
	},
}));
