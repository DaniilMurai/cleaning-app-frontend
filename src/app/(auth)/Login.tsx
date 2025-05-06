import Typography from "@/ui/Typography";
import { ActivityIndicator, View } from "react-native";
import Input from "@/ui/Input";
import { Button } from "@/ui";
import React, { useState } from "react";
import { useLogin } from "@/api/auth";
import { clearTokens, saveTokens } from "@/hooks/tokens";
import { useRouter } from "expo-router";
import useAuth from "@/app/context/AuthContext";

export default function Login() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const router = useRouter();
	const loginMutation = useLogin();
	const { checkToken } = useAuth();

	const handleLogin = async () => {
		try {
			setError("");
			const result = await loginMutation.mutateAsync({
				data: {
					nickname: login,
					password: password,
				},
			});

			await clearTokens();
			await saveTokens(result.access_token, result.refresh_token);
			if (await checkToken()) router.replace("/");
		} catch (error) {
			setError("Error logging in: " + error || "Unknown error");
			console.error("Login error:", error);
		}
	};

	if (loginMutation.isPending)
		return (
			<View
				style={{
					display: "flex",
					margin: "auto",
				}}
			>
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator size="large" />
				</View>
			</View>
		);

	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				margin: "auto",
				gap: 16, // Добавим отступы между элементами
			}}
		>
			<Typography variant="h5">Вход в систему</Typography>

			<Input
				placeholder="Введите login"
				variant="outlined"
				color="primary"
				size="medium"
				value={login}
				onChangeText={setLogin}
				error={error}
			/>

			<Input
				placeholder="Введите password"
				variant="outlined"
				color="primary"
				size="medium"
				value={password}
				onChangeText={setPassword}
				secureTextEntry={true} // Скрываем пароль
				error={error}
			/>

			{loginMutation.isError ? (
				<Typography>
					An error occurred:
					{loginMutation.error.message}
				</Typography>
			) : null}

			<Button
				variant="contained"
				onPress={() => handleLogin()}
				disabled={!login || !password} // Кнопка неактивна если поля пустые
			>
				<Typography>Войти</Typography>
			</Button>
		</View>
	);
}
