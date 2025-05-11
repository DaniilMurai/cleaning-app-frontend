import { View } from "react-native";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import Input from "@/ui/Input";
import React, { useState } from "react";
import { Button } from "@/ui";
import { useActivate } from "@/api/auth";
import { router, useLocalSearchParams } from "expo-router";
import { clearTokens, saveTokens } from "@/hooks/tokens";
import useAuth from "@/context/AuthContext";

export default function Activate() {
	const [nickname, setNickname] = useState("");
	const [password, setPassword] = useState("");
	const activateMutation = useActivate();
	const params = useLocalSearchParams();
	const token = params.token;

	const { checkToken } = useAuth();

	const handleActivate = async () => {
		if (!token) {
			console.error("Token is missing");
			return;
		}

		try {
			console.log(token);

			const result = await activateMutation.mutateAsync({
				data: {
					nickname: nickname,
					password: password,
					token: String(token),
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
			<Card variant="outlined" size="medium" style={{ width: "100%", maxWidth: 400 }}>
				<Typography variant={"h5"} style={{ textAlign: "center" }}>
					Активация
				</Typography>
				<Input
					placeholder="Введите nickname"
					variant="outlined"
					color="primary"
					size="medium"
					value={nickname}
					onChangeText={setNickname}
				/>

				<Input
					placeholder="Введите password"
					variant="outlined"
					color="primary"
					size="medium"
					value={password}
					secureTextEntry={true}
					onChangeText={setPassword}
				/>
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
					disabled={!nickname || !password || !token}
					onPress={handleActivate}
					style={{ alignItems: "center" }}
				>
					Активировать
				</Button>
			</Card>
		</View>
	);
}
