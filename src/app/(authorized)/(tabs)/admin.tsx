// src/app/(authorized)/(tabs)/admin.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import AdminTabs from "@/components/adminTabs/AdminTabs";
import LocationsTab from "@/components/adminTabs/LocationsTab/LocationsTab";
import AssignmentsTab from "@/components/Assignment/AssignmentsTab";
import { useAdminData } from "@/core/hooks/admin/useAdminData";
import useModals from "@/core/hooks/shared/useModals";
import { useAdminMutations } from "@/core/hooks/mutations/useAdminMutations";
import { useGetUsers } from "@/api/admin";
import ReportsTab from "@/components/adminTabs/ReportsTab";

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("locations");

	const adminData = useAdminData();

	const { data: users } = useGetUsers({});

	const modal = useModals({
		createLocation: false,
		createRoom: false,
		createTask: false,
		createRoomTask: false,
		createAssignment: false,
		editAssignment: false,
		editTask: false,
		editRoomTask: false,
		editLocation: false,
		editRoom: false,
		deleteAssignment: false,
		deleteAssignmentGroup: false,
		deleteTask: false,
		deleteLocation: false,
		deleteRoom: false,
		deleteRoomTask: false,
	});

	const mutations = useAdminMutations(
		{
			modals: modal.modals,
			openModal: modal.openModal as (modalName: string | number) => void,
			closeModal: modal.closeModal as (modalName: string | number) => void,
		},
		{
			locationsRefetch: adminData.locationsRefetch,
			roomsRefetch: adminData.roomsRefetch,
			tasksRefetch: adminData.tasksRefetch,
			roomTasksRefetch: adminData.roomTasksRefetch,
			dailyAssignmentsRefetch: adminData.dailyAssignmentsRefetch,
		}
	);
	return (
		<View style={styles.container}>
			<AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

			{activeTab === "locations" && (
				<LocationsTab
					locations={adminData.locations || []}
					rooms={adminData.rooms || []}
					tasks={adminData.tasks || []}
					roomTasks={adminData.roomTasks || []}
					roomMutation={mutations.roomMutation}
					roomTaskMutation={mutations.roomTaskMutation}
					locationMutation={mutations.locationMutation}
					roomTasksRefetch={adminData.roomTasksRefetch}
					tasksRefetch={adminData.tasksRefetch}
				/>
			)}

			{activeTab === "reports" && <ReportsTab />}

			{activeTab === "assignments" && (
				<AssignmentsTab
					dailyAssignmentMutation={mutations.dailyAssignmentMutation}
					modal={modal}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
}));
