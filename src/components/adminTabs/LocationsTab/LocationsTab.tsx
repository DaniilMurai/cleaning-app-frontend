// src/ui/components/admin/LocationsTab.tsx
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, ModalContainer } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import { CreateLocationForm } from "@/ui/forms/common/LocationForms";
import LocationCard from "@/components/adminTabs/LocationsTab/LocationCard";

interface LocationProps {
	locations: LocationResponse[];
	rooms: RoomResponse[];
	tasks: TaskResponse[];
	roomTasks: RoomTaskResponse[];
	locationMutation: any;
	roomMutation: any;
	roomTaskMutation: any;
	roomTasksRefetch: any;
	tasksRefetch: any;
}

export default function LocationsTab({
	locations,
	rooms,
	tasks,
	roomTasks,
	locationMutation,
	roomTaskMutation,
	roomMutation,
	roomTasksRefetch,
	tasksRefetch,
}: LocationProps) {
	const [showCreateLocation, setShowCreateLocation] = useState(false);

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
							rooms={rooms}
							locations={locations}
							tasks={tasks}
							roomTasks={roomTasks}
							roomMutation={roomMutation}
							roomTaskMutation={roomTaskMutation}
							roomTasksRefetch={roomTasksRefetch}
							tasksRefetch={tasksRefetch}
							locationMutation={locationMutation}
						/>
					))}
			</ScrollView>

			<ModalContainer
				visible={showCreateLocation}
				onClose={() => setShowCreateLocation(false)}
			>
				<CreateLocationForm
					onSubmit={locationMutation.handleCreateLocation}
					onClose={() => setShowCreateLocation(false)}
					isLoading={locationMutation.createLocationMutation.isPending}
				/>
			</ModalContainer>
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
