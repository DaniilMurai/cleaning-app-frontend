import Typography from "@/ui/common/Typography";
import { View } from "react-native";
import Input from "@/ui/common/Input";
import { Button } from "@/ui";
import React from "react";
import { useLogin } from "@/api/auth";
import { Redirect } from "expo-router";
import { useAuth } from "@/core/auth";
import Card from "@/ui/common/Card";
import Loading from "@/ui/common/Loading";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/ui/components/passwords/PasswordInput";
import { useForm } from "@tanstack/react-form";
import { usePasswordValidator } from "@/core/validators";

export default function Login() {
	const { t } = useTranslation();

	const { onLogin, isAuthorised, isLoaded } = useAuth();

	const login = useLogin({
		mutation: {
			onSuccess: onLogin,
		},
	});

	const form = useForm({
		defaultValues: {
			nickname: "",
			password: "",
		},
		onSubmit: ({ value: data }) => login.mutate({ data }),
	});

	const passwordValidator = usePasswordValidator(1);

	if (!isLoaded) {
		return <Loading />;
	}

	if (isAuthorised) {
		console.log("Authorised");
		return <Redirect href={"/"} />;
	}

	return (
		<View style={styles.container}>
			<Card variant="contained" size="medium" style={styles.card}>
				<Typography style={{ textAlign: "center" }} variant="h5">
					{t("auth.signIn")}
				</Typography>

				<form.Field name={"nickname"}>
					{field => (
						<Input
							autoCapitalize={"none"}
							placeholder={t("auth.login")}
							variant={"outlined"}
							color={"primary"}
							size={"medium"}
							value={field.state.value}
							style={styles.input}
							onChangeText={field.handleChange}
						/>
					)}
				</form.Field>

				<form.Field
					name={"password"}
					validators={{
						onSubmit: ({ value }) => passwordValidator(value),
					}}
				>
					{field => (
						<PasswordInput
							style={styles.input}
							placeholder={t("auth.password")}
							value={field.state.value}
							onChangeText={field.handleChange}
						/>
					)}
				</form.Field>

				{login.isError ? (
					login.error.status === 401 ? (
						<Typography variant="body2" color="error">
							{t("auth.invalidCredentials")}
						</Typography>
					) : (
						<Typography variant="body2" color="error">
							{t("auth.loginError")} {login.error.message}
						</Typography>
					)
				) : null}

				<form.Subscribe
					selector={state =>
						state.canSubmit && !!state.values.nickname && !!state.values.password
					}
				>
					{canSubmit => (
						<Button
							variant="outlined"
							onPress={() => form.handleSubmit()}
							style={styles.button}
							size="small"
							loading={login.isPending}
							disabled={!canSubmit}
						>
							{t("auth.signIn")}
						</Button>
					)}
				</form.Subscribe>
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
