// src/components/admin/AdminTabs.tsx
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Typography } from "@/ui";
import { StyleSheet } from "react-native-unistyles";

interface AdminTabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export function AdminTabs({ activeTab, setActiveTab }: AdminTabsProps) {
	const { t } = useTranslation();

	return (
		<View style={styles.tabContainer}>
			<TouchableOpacity
				style={[styles.tab, activeTab === "locations" && styles.activeTab]}
				onPress={() => setActiveTab("locations")}
			>
				<Typography
					style={[styles.tabText, activeTab === "locations" && styles.activeTabText]}
				>
					{t("admin.locations")}
				</Typography>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab, activeTab === "tasks" && styles.activeTab]}
				onPress={() => setActiveTab("tasks")}
			>
				<Typography style={[styles.tabText, activeTab === "tasks" && styles.activeTabText]}>
					{t("admin.tasks")}
				</Typography>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tab, activeTab === "assignments" && styles.activeTab]}
				onPress={() => setActiveTab("assignments")}
			>
				<Typography
					style={[styles.tabText, activeTab === "assignments" && styles.activeTabText]}
				>
					{t("admin.assignments")}
				</Typography>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	tabContainer: {
		flexDirection: "row",
		backgroundColor: theme.colors.background.default,
		elevation: 4,
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	tab: {
		flex: 1,
		paddingVertical: theme.spacing(2),
		alignItems: "center",
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor:
			typeof theme.colors.primary === "object"
				? theme.colors.primary.main
				: theme.colors.primary,
	},
	tabText: {
		color:
			typeof theme.colors.text === "object" ? theme.colors.text.primary : theme.colors.text,
	},
	activeTabText: {
		color:
			typeof theme.colors.primary === "object"
				? theme.colors.primary.main
				: theme.colors.primary,
		fontWeight: "600",
	},
}));
