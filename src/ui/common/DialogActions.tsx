import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function DialogActions(props: ViewProps) {
	return (
		<View {...props} style={[styles.dialogActions, props.style]}>
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	dialogActions: {
		flexWrap: "wrap",
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: theme.spacing(3),
		gap: theme.spacing(2),
	},
}));
