import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { clearTokens } from "@/hooks/tokens";
import { useState } from "react";
import { Button } from "@/ui";
import { useRouter } from "expo-router";

export default function ProfilePage() {
	const [error, setError] = useState("");
	const router = useRouter();

	const logout = async () => {
		try {
			setError("");
			await clearTokens();
			router.replace("/Login");
		} catch (error) {
			setError("Couldn't log out" + error);
		}
	};

	return (
		<View style={styles.container}>
			<Typography>Это страница профиля</Typography>
			<Button variant={"contained"} onPress={() => logout()}>
				<Typography>Выйти</Typography>
			</Button>

			{error ? <Typography>Error occurred: {error}</Typography> : null}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
}));
