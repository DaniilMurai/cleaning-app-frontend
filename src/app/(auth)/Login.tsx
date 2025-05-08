import Typography from "@/ui/Typography";
import { View } from "react-native";
import Input from "@/ui/Input";
import { Button } from "@/ui";
import React, { useState } from "react";
import { useLogin } from "@/api/auth";
import { clearTokens, saveTokens } from "@/hooks/tokens";
import { Redirect, useRouter } from "expo-router";
import useAuth from "@/context/AuthContext";
import Card from "@/ui/Card";

export default function Login() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();
	const loginMutation = useLogin();
	const { checkToken, token, loading } = useAuth();

	// if (loading) {
	// 	return (
	// 		<View
	// 			style={{
	// 				display: "flex",
	// 				margin: "auto",
	// 			}}
	// 		>
	// 			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
	// 				<ActivityIndicator size="large" />
	// 			</View>
	// 		</View>
	// 	);
	// }

	if (token) {
		return <Redirect href={"/"} />;
	}

	const handleLogin = async () => {
		try {
			const result = await loginMutation.mutateAsync({
				data: {
					nickname: login,
					password: password,
				},
			});

			await clearTokens();
			await saveTokens(result.access_token, result.refresh_token);
			if (await checkToken()) {
				router.replace("/");
			}
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Card variant="contained" size="medium" style={{ width: "100%", maxWidth: 400 }}>
				<Typography style={{ textAlign: "center" }} variant="h5">
					Вход в систему
				</Typography>

				<Input
					placeholder="Введите login"
					variant="outlined"
					color="primary"
					size="medium"
					value={login}
					onChangeText={setLogin}
				/>

				<Input
					placeholder="Введите password"
					variant="outlined"
					color="primary"
					size="medium"
					value={password}
					onChangeText={setPassword}
					secureTextEntry={true} // Скрываем пароль
				/>

				{loginMutation.isError ? (
					loginMutation.error.status === 401 ? (
						<Typography variant="body2" color="error">
							Incorrect login or password
						</Typography>
					) : (
						<Typography variant="body2" color="error">
							An error occurred: {loginMutation.error.message}
						</Typography>
					)
				) : null}

				<Button
					variant="contained"
					onPress={() => handleLogin()}
					style={{ alignItems: "center" }}
					size="small"
					loading={loginMutation.isPending}
					disabled={!login || !password} // Кнопка неактивна если поля пустые
				>
					Войти
				</Button>
			</Card>
		</View>
	);
}
