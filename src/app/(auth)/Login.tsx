import Typography from "@/ui/common/Typography";
import { View } from "react-native";
import Input from "@/ui/common/Input";
import { Button } from "@/ui";
import React, { useRef, useState } from "react";
import { useLogin } from "@/api/auth";
import { clearTokens, saveTokens } from "@/core/hooks/shared/tokens";
import { Redirect, useRouter } from "expo-router";
import useAuth from "@/core/context/AuthContext";
import Card from "@/ui/common/Card";
import Loading from "@/ui/common/Loading";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import PasswordInput, { PasswordInputsRef } from "@/ui/components/passwords/PasswordInput";

export default function Login() {
	const { t } = useTranslation();

	const [login, setLogin] = useState("");

	const router = useRouter();
	const loginMutation = useLogin();
	const { checkToken, token, loading } = useAuth();

	const passwordInputRef = useRef<PasswordInputsRef>(null);

	if (loading) {
		return <Loading />;
	}

	if (token) {
		console.log(token);
		console.log("Token is valid");
		return <Redirect href={"/"} />;
	}

	const handleLogin = async () => {
		console.log("handleLogin");
		try {
			if (passwordInputRef.current) {
				const validationResult = passwordInputRef.current.validate();
				if (validationResult.isValid) {
					const result = await loginMutation.mutateAsync({
						data: {
							nickname: login,
							password: validationResult.password,
						},
					});

					if (result.access_token) {
						console.log("access_token: " + result.access_token);
						await clearTokens();
						await saveTokens(result.access_token, result.refresh_token);
						const isValid = await checkToken();
						if (isValid) {
							router.replace("/");
						}
					}
				}
			}
			console.log("No login");
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Card variant="contained" size="medium" style={styles.card}>
				<Typography style={{ textAlign: "center" }} variant="h5">
					{t("auth.signIn")}
				</Typography>

				<Input
					placeholder={t("auth.login")}
					variant="outlined"
					color="primary"
					size="medium"
					value={login}
					style={styles.input}
					onChangeText={setLogin}
				/>

				<PasswordInput
					style={styles.input}
					placeholder={t("auth.password")}
					minLength={1}
					ref={passwordInputRef}
				/>

				{/*<Input*/}
				{/*	placeholder={t("auth.password")}*/}
				{/*	variant="outlined"*/}
				{/*	color="primary"*/}
				{/*	size="medium"*/}
				{/*	value={password}*/}
				{/*	onChangeText={setPassword}*/}
				{/*	style={styles.input}*/}
				{/*	secureTextEntry={true} // Скрываем пароль*/}
				{/*/>*/}

				{loginMutation.isError ? (
					loginMutation.error.status === 401 ? (
						<Typography variant="body2" color="error">
							{t("auth.invalidCredentials")}
						</Typography>
					) : (
						<Typography variant="body2" color="error">
							{t("auth.loginError")} {loginMutation.error.message}
						</Typography>
					)
				) : null}

				<Button
					variant="contained"
					onPress={() => handleLogin()}
					style={styles.button}
					size="small"
					loading={loginMutation.isPending}
					disabled={!login} // Кнопка неактивна если поля пустые
				>
					{t("auth.signIn")}
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
	input: {
		marginBottom: theme.spacing(0.5),
	},
	button: {
		alignItems: "center",
	},
	card: {
		width: "100%",
		maxWidth: 400,
	},
}));
