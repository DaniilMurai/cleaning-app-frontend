import { View } from "react-native";
import ExportReportsPanel from "@/components/reports/ExportReportsPanel";
import { StyleSheet } from "react-native-unistyles";

export default function ExportReportsTab() {
	return (
		<View style={styles.container}>
			<ExportReportsPanel />
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingHorizontal: {
			xs: theme.spacing(2),
			lg: theme.spacing(4),
			xl: theme.spacing(5),
			xxl: theme.spacing(12),
		},
		paddingVertical: theme.spacing(4),
	},
}));
