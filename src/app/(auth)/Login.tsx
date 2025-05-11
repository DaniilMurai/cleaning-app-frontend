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
import Loading from "@/ui/Loading";

export default function Login() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();
	const loginMutation = useLogin();
	const { checkToken, token, loading } = useAuth();

	if (loading) {
		return <Loading />;
	}

	if (token) {
		console.log("Token is valid");
		return <Redirect href={"/"} />;
	}

	const handleLogin = async () => {
		console.log("handleLogin");
		try {
			const result = await loginMutation.mutateAsync({
				data: {
					nickname: login,
					password: password,
				},
			});

			if (result.access_token) {
				await clearTokens();
				await saveTokens(result.access_token, result.refresh_token);
				const isValid = await checkToken();
				if (isValid) {
					router.replace("/");
				}
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
