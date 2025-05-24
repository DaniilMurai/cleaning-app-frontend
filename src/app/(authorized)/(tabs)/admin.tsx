import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button } from "@/ui";
import { useRouter } from "expo-router";

export default function AdminPage() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Typography>Это страница Tasks</Typography>
			<Button onPress={() => router.push("/Login")}>to Login</Button>
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
