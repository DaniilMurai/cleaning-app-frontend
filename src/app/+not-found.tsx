import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui";

export default function NotFoundScreen() {
	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Oops, Not Found" }} />
			<Link href="/">
				<Button variant={"text"}>Not Found</Button>
			</Link>
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
