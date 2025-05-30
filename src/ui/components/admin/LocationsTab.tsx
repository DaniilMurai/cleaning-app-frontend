// src/ui/components/admin/LocationsTab.tsx
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button, Card, ModalContainer } from "@/ui";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/Collapse";
import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import {
	CreateLocationForm,
	DeleteLocationConfirm,
	EditLocationForm,
} from "@/ui/forms/LocationForms";
import {
	CreateRoomForm,
	DeleteRoomConfirm as DeleteRoomConfirm,
	EditRoomForm,
} from "@/ui/forms/RoomForms";
import TasksList from "@/ui/components/admin/TasksList";

interface LocationProps {
	locations: LocationResponse[];
	rooms: RoomResponse[];
	tasks: TaskResponse[];
	roomTasks: RoomTaskResponse[];
	locationMutation: any;
	roomMutation: any;
	roomTaskMutation: any;
	modal: any;
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
	modal,
	roomTasksRefetch,
	tasksRefetch,
}: LocationProps) {
	const { t } = useTranslation();

	// Состояния для управления развернутыми/свернутыми элементами
	const [expandedLocations, setExpandedLocations] = useState<Record<number, boolean>>({});
	const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

	const [selectedLocation, setSelectedLocation] = useState<LocationResponse | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);

	// Функции для переключения состояния развертывания
	const toggleLocation = (id: number) => {
		setExpandedLocations(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleRoom = (locationId: number, roomId: number) => {
		const key = `${locationId}-${roomId}`;
		setExpandedRooms(prev => ({ ...prev, [key]: !prev[key] }));
	};

	// Находим задачи для комнаты
	const getRoomTasks = (roomId: number) => {
		if (roomTasks) {
			const roomTaskIds = roomTasks.filter(rt => rt.room_id === roomId).map(rt => rt.task_id);

			if (tasks) return tasks.filter(task => roomTaskIds.includes(task.id));
		}
		return [];
	};

	const getRoomTaskId = (roomId: number, taskId: number) => {
		return roomTasks && roomTasks.filter(rt => rt.room_id === roomId && rt.task_id === taskId);
	};

	const deleteRoomTask = async (roomTask: RoomTaskResponse) => {
		await roomTaskMutation.handleDeleteRoomTask({ room_task_id: roomTask.id });
	};

	// Модальные окна для Location
	const renderLocationModals = () => (
		<>
			{modal.modals.createLocation && (
				<ModalContainer
					visible={modal.modals.createLocation}
					onClose={() => modal.closeModal("createLocation")}
				>
					<CreateLocationForm
						onSubmit={locationMutation.handleCreateLocation}
						onClose={() => modal.closeModal("createLocation")}
						isLoading={locationMutation.createLocationMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.editLocation && selectedLocation && (
				<ModalContainer
					visible={modal.modals.editLocation}
					onClose={() => modal.closeModal("editLocation")}
				>
					<EditLocationForm
						location={selectedLocation}
						onSubmit={locationMutation.handleUpdateLocation}
						onClose={() => modal.closeModal("editLocation")}
						isLoading={locationMutation.updateLocationMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.deleteLocation && selectedLocation && (
				<ModalContainer
					visible={modal.modals.deleteLocation}
					onClose={() => modal.closeModal("deleteLocation")}
				>
					<DeleteLocationConfirm
						location={selectedLocation}
						onConfirm={locationMutation.handleDeleteLocation}
						onClose={() => modal.closeModal("deleteLocation")}
						isLoading={locationMutation.deleteLocationMutation.isPending}
					/>
				</ModalContainer>
			)}
		</>
	);

	// Модальные окна для Room
	const renderRoomModals = () => (
		<>
			{modal.modals.createRoomTask && selectedRoom && (
				<ModalContainer
					visible={modal.modals.createRoomTask}
					onClose={() => modal.closeModal("createRoomTask")}
				>
					<TasksList
						onClose={() => modal.closeModal("createRoomTask")}
						tasks={tasks}
						rooms={rooms}
						room={selectedRoom}
						locations={locations}
						roomTasks={roomTasks}
						tasksRefetch={tasksRefetch}
						roomTasksRefetch={roomTasksRefetch}
					/>
				</ModalContainer>
			)}

			{modal.modals.createRoom && selectedLocation && (
				<ModalContainer
					visible={modal.modals.createRoom}
					onClose={() => modal.closeModal("createRoom")}
				>
					<CreateRoomForm
						onSubmit={roomMutation.handleCreateRoom}
						onClose={() => modal.closeModal("createRoom")}
						location_id={selectedLocation.id}
						isLoading={roomMutation.createRoomMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.editRoom && selectedRoom && (
				<ModalContainer
					visible={modal.modals.editRoom}
					onClose={() => modal.closeModal("editRoom")}
				>
					<EditRoomForm
						onSubmit={roomMutation.handleUpdateRoom}
						onClose={() => modal.closeModal("editRoom")}
						room={selectedRoom}
						isLoading={roomMutation.updateRoomMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.deleteRoom && selectedRoom && (
				<ModalContainer
					visible={modal.modals.deleteRoom}
					onClose={() => modal.closeModal("deleteRoom")}
				>
					<DeleteRoomConfirm
						room={selectedRoom}
						onConfirm={roomMutation.handleDeleteRoom}
						onClose={() => modal.closeModal("deleteRoom")}
						isLoading={roomMutation.deleteRoomMutation.isPending}
					/>
				</ModalContainer>
			)}
		</>
	);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant="contained" onPress={() => modal.openModal("createLocation")}>
						<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
					</Button>
				</View>

				{locations &&
					locations.map(location => (
						<Card key={location.id} style={styles.card}>
							<TouchableOpacity
								style={styles.cardHeader}
								onPress={() => toggleLocation(location.id)}
							>
								<View style={styles.headerWithIcon}>
									<FontAwesome5
										name={
											expandedLocations[location.id]
												? "angle-down"
												: "angle-right"
										}
										size={16}
										color={styles.collapseIcon.color}
									/>
									<Typography variant="h5">{location.name}</Typography>
								</View>
								<View style={styles.actionButtons}>
									<Button
										variant="outlined"
										onPress={() => {
											setSelectedLocation(location);
											modal.openModal("editLocation");
										}}
									>
										<FontAwesome5 name="edit" size={14} />
									</Button>
									<Button
										variant="outlined"
										style={styles.deleteButton}
										onPress={() => {
											setSelectedLocation(location);
											modal.openModal("deleteLocation");
										}}
									>
										<FontAwesome5 name="trash" size={14} />
									</Button>
								</View>
							</TouchableOpacity>

							<Collapse expanded={expandedLocations[location.id]}>
								<Typography>{location.address}</Typography>

								<View style={styles.divider} />
								<Typography variant="subtitle1">{t("admin.rooms")}</Typography>

								{rooms &&
								rooms.filter(room => room.location_id === location.id).length ===
									0 ? (
									<Typography style={styles.emptyState}>
										{t("admin.noRooms")}
									</Typography>
								) : (
									rooms &&
									rooms
										.filter(room => room.location_id === location.id)
										.map(room => (
											<View key={room.id} style={styles.roomSection}>
												<TouchableOpacity
													style={styles.roomHeader}
													onPress={() => toggleRoom(location.id, room.id)}
												>
													<View style={styles.headerWithIcon}>
														<FontAwesome5
															name={
																expandedRooms[
																	`${location.id}-${room.id}`
																]
																	? "angle-down"
																	: "angle-right"
															}
															size={14}
															color={styles.collapseIcon.color}
														/>
														<Typography>{room.name}</Typography>
													</View>
													<View style={styles.actionButtons}>
														<Button
															variant="text"
															onPress={() => {
																setSelectedRoom(room);
																modal.openModal("editRoom");
															}}
														>
															<FontAwesome5 name="edit" size={14} />
														</Button>
														<Button
															variant="text"
															style={styles.deleteButton}
															onPress={() => {
																setSelectedRoom(room);
																modal.openModal("deleteRoom");
															}}
														>
															<FontAwesome5 name="trash" size={14} />
														</Button>
													</View>
												</TouchableOpacity>

												<Collapse
													expanded={
														expandedRooms[`${location.id}-${room.id}`]
													}
												>
													<View style={styles.roomTasks}>
														<Typography variant="subtitle2">
															{t("admin.tasks")}
														</Typography>
														{getRoomTasks(room.id).length > 0 ? (
															getRoomTasks(room.id).map(task => (
																<View
																	key={task.id}
																	style={styles.roomTaskItem}
																>
																	<Typography>
																		{task.title}
																	</Typography>
																	<View
																		style={styles.actionButtons}
																	>
																		<Button
																			variant="text"
																			style={
																				styles.deleteButton
																			}
																		>
																			<FontAwesome5
																				name="unlink"
																				size={12}
																				onPress={() => {
																					console.log(
																						"unlink"
																					);
																					const roomTaskIds =
																						getRoomTaskId(
																							room.id,
																							task.id
																						);
																					if (
																						roomTaskIds &&
																						roomTaskIds.length >
																							0
																					) {
																						const roomTaskObj =
																							roomTaskIds[0];
																						deleteRoomTask(
																							roomTaskObj
																						);
																					}
																				}}
																			/>
																		</Button>
																	</View>
																</View>
															))
														) : (
															<Typography style={styles.emptyState}>
																{t("admin.noAssignments")}
															</Typography>
														)}
														<Button
															variant="text"
															style={styles.addButton}
															onPress={() => {
																setSelectedRoom(room);
																modal.openModal("createRoomTask");
															}}
														>
															<FontAwesome5 name="plus" size={14} />
															{t("admin.addTask")}
														</Button>
													</View>
												</Collapse>
											</View>
										))
								)}

								<Button
									variant="outlined"
									style={styles.addButton}
									onPress={() => {
										setSelectedLocation(location);
										modal.openModal("createRoom");
									}}
								>
									<FontAwesome5 name="plus" size={14} />
									{t("admin.addRoom")}
								</Button>
							</Collapse>
						</Card>
					))}
			</ScrollView>

			{/* Modals */}
			{renderLocationModals()}
			{renderRoomModals()}
		</View>
	);
}
const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
	},

	card: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		alignItems: "center",
		marginBottom: theme.spacing(1),
	},
	headerWithIcon: {
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	actionButtons: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	deleteButton: {
		borderColor: theme.colors.error.main,
		color: theme.colors.error.main,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	roomSection: {
		marginTop: theme.spacing(1),
	},
	roomHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
	},

	roomTasks: {
		paddingLeft: theme.spacing(4),
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	roomTaskItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
	},
	addButton: {
		marginTop: theme.spacing(1),
		alignSelf: "flex-start",
	},
	emptyState: {
		fontStyle: "italic",
		color: theme.colors.text.secondary,
		marginVertical: theme.spacing(1),
	},
	iconColor: {
		color: theme.colors.primary.text,
	},
}));
