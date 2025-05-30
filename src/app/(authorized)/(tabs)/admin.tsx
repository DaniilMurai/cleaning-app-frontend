// src/app/(authorized)/(tabs)/admin.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { AdminTabs } from "@/ui/components/admin/AdminTabs";
import LocationsTab from "@/ui/components/admin/LocationsTab";
import TasksTab from "@/ui/components/admin/TasksTab";
import AssignmentsTab from "@/ui/components/admin/AssignmentsTab";
import { useAdminData } from "@/hooks/useAdminData";
import useModals from "@/hooks/useModals";
import { useAdminMutations } from "@/hooks/useAdminMutations";
import { useGetUsers } from "@/api/admin";

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
					modal={modal}
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
			{activeTab === "tasks" && (
				<TasksTab
					tasks={adminData.tasks || []}
					rooms={adminData.rooms || []}
					locations={adminData.locations || []}
					roomTasks={adminData.roomTasks || []}
					taskMutation={mutations.taskMutation}
					roomTaskMutation={mutations.roomTaskMutation}
					modal={modal}
				/>
			)}

			{activeTab === "assignments" && (
				<AssignmentsTab
					locations={adminData.locations || []}
					dailyAssignments={adminData.dailyAssignments || []}
					users={users}
					dailyAssignmentsIsLoading={adminData.dailyAssignmentsIsLoading}
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
