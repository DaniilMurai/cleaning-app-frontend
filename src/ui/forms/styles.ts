import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(3),
		maxWidth: 600,
		width: "100%",
		alignSelf: "center",
	},
	title: {
		marginBottom: theme.spacing(3),
	},
	input: {
		marginBottom: theme.spacing(2),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		marginTop: theme.spacing(3),
	},
}));
