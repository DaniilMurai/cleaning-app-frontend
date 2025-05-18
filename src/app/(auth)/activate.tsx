import { View } from "react-native";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import Input from "@/ui/Input";
import React, { useRef, useState } from "react";
import { Button } from "@/ui";
import { useActivate } from "@/api/auth";
import { router, useLocalSearchParams } from "expo-router";
import { clearTokens, saveTokens } from "@/hooks/tokens";
import useAuth from "@/context/AuthContext";
import PasswordInputs, { PasswordInputsRef } from "@/ui/components/common/2PasswordInputs";
import { StyleSheet } from "react-native-unistyles";

export default function Activate() {
	const [nickname, setNickname] = useState("");
	const activateMutation = useActivate();
	const params = useLocalSearchParams();
	const token = params.token;

	const passwordInputsRef = useRef<PasswordInputsRef>(null);

	const { checkToken } = useAuth();

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
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Card variant="outlined" size="medium" style={{ width: "100%", maxWidth: 400 }}>
				<Typography variant={"h5"} style={{ textAlign: "center" }}>
					Активация
				</Typography>
				<Input
					placeholder="Введите nickname"
					variant="outlined"
					color="primary"
					size="medium"
					style={styles.input}
					value={nickname}
					onChangeText={setNickname}
				/>

				<PasswordInputs minLength={8} ref={passwordInputsRef} />

				{activateMutation.isError && (
					<Typography variant="body2" color="error">
						{String(activateMutation.failureReason?.response?.data.detail) ||
							"An error occurred"}
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
					Активировать
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
