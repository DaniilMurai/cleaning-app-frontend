import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { useState } from "react";
import { Button } from "@/ui";
import { useRouter } from "expo-router";
import useAuth from "@/context/AuthContext";

export default function ProfilePage() {
	const [error, setError] = useState("");
	const router = useRouter();
	const { logout, user } = useAuth();

	const handleLogout = async () => {
		try {
			setError("");

			await logout();
			router.replace("/Login");
		} catch (error) {
			setError("Couldn't log out" + error);
		}
	};

	return (
		<View style={styles.container}>
			<Typography>Это страница профиля</Typography>
			<Typography>
				Current user: id: {user?.id}, nickname: {user?.nickname}, role: {user?.role}
			</Typography>
			<Button variant={"contained"} onPress={() => handleLogout()}>
				Выйти
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
