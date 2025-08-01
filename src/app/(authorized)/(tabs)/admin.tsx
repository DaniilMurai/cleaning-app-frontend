// src/app/(authorized)/(tabs)/admin.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import AdminTabs from "@/components/adminTabs/AdminTabs";
import LocationsTab from "@/components/adminTabs/LocationsTab/LocationsTab";
import AssignmentsTab from "@/components/Assignment/AssignmentsTab";
import ReportsTab from "@/components/adminTabs/ReportsTab";

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("locations");

	return (
		<View style={styles.container}>
			<AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

			{activeTab === "locations" && <LocationsTab />}

			{activeTab === "reports" && <ReportsTab />}

			{activeTab === "assignments" && <AssignmentsTab />}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
}));
