// src/ui/components/admin/LocationsTab.tsx
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Dialog } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGetLocations, useGetRooms, useGetRoomTasks, useGetTasksWithHints } from "@/api/admin";
import { CreateLocationForm } from "@/ui/forms/common/LocationForms";
import LocationCard from "@/components/adminTabs/LocationsTab/LocationCard";
import useModals from "@/core/hooks/shared/useModals";
import { useAdminMutations } from "@/core/hooks/mutations/useAdminMutations";

export default function LocationsTab() {
	const [showCreateLocation, setShowCreateLocation] = useState(false);

	const { data: locations } = useGetLocations();
	const { data: rooms } = useGetRooms();
	// const { data: tasks } = useGetTasks();
	const { data: tasks } = useGetTasksWithHints();
	const { data: roomTasks } = useGetRoomTasks();

	const modal = useModals({
		createLocation: false,
		createRoom: false,
		createTask: false,
		createRoomTask: false,
		editTask: false,
		editRoomTask: false,
		editLocation: false,
		editRoom: false,
		deleteTask: false,
		deleteLocation: false,
		deleteRoom: false,
		deleteRoomTask: false,
	});

	const { locationMutation, roomTaskMutation, roomMutation } = useAdminMutations({
		modals: modal.modals,
		openModal: modal.openModal as (modalName: string | number) => void,
		closeModal: modal.closeModal as (modalName: string | number) => void,
	});

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant="contained" onPress={() => setShowCreateLocation(true)}>
						<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
					</Button>
				</View>

				{locations &&
					locations.map(location => (
						<LocationCard
							key={location.id}
							location={location}
							rooms={rooms || []}
							locations={locations}
							tasks={tasks || []}
							roomTasks={roomTasks || []}
							roomMutation={roomMutation}
							roomTaskMutation={roomTaskMutation}
							locationMutation={locationMutation}
						/>
					))}
			</ScrollView>

			<Dialog visible={showCreateLocation} onClose={() => setShowCreateLocation(false)}>
				<CreateLocationForm
					onSubmit={locationMutation.handleCreateLocation}
					onClose={() => setShowCreateLocation(false)}
					isLoading={locationMutation.createLocationMutation.isPending}
				/>
			</Dialog>
		</View>
	);
}
const styles = StyleSheet.create(theme => ({
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
	},

	iconColor: {
		color: theme.colors.primary.text,
	},
}));
