// src/app/(authorized)/(tabs)/admin.tsx
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button, Card, ModalContainer } from "@/ui";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/Collapse";
import {
	LocationResponse,
	RoomResponse,
	RoomTaskResponse,
	TaskResponse,
	useGetDailyAssignments,
	useGetLocations,
	useGetRooms,
	useGetRoomTasks,
	useGetTasks,
} from "@/api/admin";
import { useLocationMutation } from "@/hooks/useLocationMutation";
import useDailyAssignmentMutation from "@/hooks/useDailyAssignmentMutation";
import useRoomMutation from "@/hooks/useRoomMutation";
import useTaskMutation from "@/hooks/useTaskMutation";
import useRoomTaskMutation from "@/hooks/useRoomTaskMutation";
import {
	CreateLocationForm,
	DeleteLocationConfirm,
	EditLocationForm,
} from "@/ui/forms/LocationForms";
import { CreateRoomForm, DeleteRoomConfirm, EditRoomForm } from "@/ui/forms/RoomForms";
import { CreateTaskForm, DeleteTaskConfirm, EditTaskForm } from "@/ui/forms/TaskForms";
import TasksList from "@/ui/components/admin/TasksList";
import useModals from "@/hooks/useModals";
import { createMutationHandlersFactory } from "@/utils/mutationHandlers";

export default function AdminPage() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("locations");

	// Состояния для управления развернутыми/свернутыми элементами
	const [expandedLocations, setExpandedLocations] = useState<Record<number, boolean>>({});
	const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});
	const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});

	const {
		data: locations,
		isLoading: locationsIsLoading,
		refetch: locationsRefetch,
	} = useGetLocations({});

	const { data: rooms, isLoading: roomsIsLoading, refetch: roomsRefetch } = useGetRooms({});

	const { data: tasks, isLoading: tasksIsLoading, refetch: tasksRefetch } = useGetTasks({});

	const {
		data: roomTasks,
		isLoading: roomTasksIsLoading,
		refetch: roomTasksRefetch,
	} = useGetRoomTasks({});

	const {
		data: dailyAssignments,
		isLoading: dailyAssignmentsIsLoading,
		refetch: dailyAssignmentsRefetch,
	} = useGetDailyAssignments({});

	const modal = useModals({
		createLocation: false,
		createRoom: false,
		createTask: false,
		createRoomTask: false,
		createAssignment: false,
		editLocation: false,
		editRoom: false,
		editTask: false,
		editRoomTask: false,
		editAssignment: false,
		deleteLocation: false,
		deleteRoom: false,
		deleteTask: false,
		deleteRoomTask: false,
		deleteAssignment: false,
	});

	// Создадим функцию для стандартизации обработчиков мутаций
	const createMutationHandlers = createMutationHandlersFactory(
		modal as {
			modals: Record<string, boolean>;
			openModal: (modalName: string | number) => void;
			closeModal: (modalName: string | number) => void;
		}
	);
	// Теперь используем эту функцию для всех мутаций
	const locationMutationHandlers = {
		...createMutationHandlers("Location"),
		refetch: locationsRefetch,
	};

	const roomMutationHandlers = {
		...createMutationHandlers("Room"),
		refetch: roomsRefetch,
	};

	const taskMutationHandlers = {
		...createMutationHandlers("Task"),
		refetch: tasksRefetch,
	};

	const roomTaskMutationHandlers = {
		...createMutationHandlers("RoomTask"),
		refetch: roomTasksRefetch,
	};

	const dailyAssignmentMutationHandlers = {
		...createMutationHandlers("Assignment"),
		refetch: dailyAssignmentsRefetch,
	};

	// Теперь инициализируем все хуки мутаций
	const locationMutation = useLocationMutation(locationMutationHandlers);
	const roomMutation = useRoomMutation(roomMutationHandlers);
	const taskMutation = useTaskMutation(taskMutationHandlers);
	const roomTaskMutation = useRoomTaskMutation(roomTaskMutationHandlers);
	const dailyAssignmentMutation = useDailyAssignmentMutation(dailyAssignmentMutationHandlers);

	// Функции для переключения состояния развертывания
	const toggleLocation = (id: number) => {
		setExpandedLocations(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleRoom = (locationId: number, roomId: number) => {
		const key = `${locationId}-${roomId}`;
		setExpandedRooms(prev => ({ ...prev, [key]: !prev[key] }));
	};

	const toggleTask = (id: number) => {
		setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
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

	const [selectedLocation, setSelectedLocation] = useState<LocationResponse | null>(null);
	const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
	const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

	const deleteRoomTask = async (roomTask: RoomTaskResponse) => {
		await roomTaskMutation.handleDeleteRoomTask({ room_task_id: roomTask.id });
	};

	const renderLocations = () => (
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
		</View>
	);

	const renderTasks = () => (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant="contained">
						<FontAwesome5
							name="plus"
							size={16}
							color={styles.iconColor.color}
							onPress={() => {
								modal.openModal("createTask");
							}}
						/>
					</Button>
				</View>

				{tasks &&
					tasks.map(task => (
						<Card key={task.id} style={styles.card}>
							<TouchableOpacity
								style={styles.cardHeader}
								onPress={() => toggleTask(task.id)}
							>
								<View style={styles.headerWithIcon}>
									<FontAwesome5
										name={expandedTasks[task.id] ? "angle-down" : "angle-right"}
										size={16}
										color={styles.collapseIcon.color}
									/>
									<Typography variant="h5">{task.title}</Typography>
								</View>
								<View style={styles.actionButtons}>
									<Button
										variant="outlined"
										onPress={() => {
											setSelectedTask(task);
											modal.openModal("editTask");
										}}
									>
										<FontAwesome5 name="edit" size={14} />
									</Button>
									<Button
										variant="outlined"
										style={styles.deleteButton}
										onPress={() => {
											setSelectedTask(task);
											modal.openModal("deleteTask");
										}}
									>
										<FontAwesome5 name="trash" size={14} />
									</Button>
								</View>
							</TouchableOpacity>

							<Collapse expanded={expandedTasks[task.id]}>
								<Typography>
									{task.description || t("common.noDescription")}
								</Typography>
								<Typography variant="h5">
									{t("admin.frequency")}:{" "}
									{task.frequency === 1
										? t("admin.daily")
										: t("admin.everyXDays", { count: task.frequency })}
								</Typography>

								<View style={styles.divider} />
								<Typography variant="subtitle2">
									{t("admin.assignedRooms")}
								</Typography>

								{rooms &&
									locations &&
									roomTasks &&
									roomTasks
										.filter(rt => rt.task_id === task.id)
										.map(roomTask => {
											const room = rooms.find(r => r.id === roomTask.room_id);
											const location = room
												? locations.find(l => l.id === room.location_id)
												: null;

											return room && location ? (
												<View
													key={roomTask.id}
													style={styles.assignmentItem}
												>
													<Typography>
														{location.name} - {room.name}
													</Typography>
													<Button
														variant="text"
														style={styles.deleteButton}
														onPress={() => {
															console.log("unlink");
															const roomTaskIds = getRoomTaskId(
																room.id,
																task.id
															);
															if (
																roomTaskIds &&
																roomTaskIds.length > 0
															) {
																const roomTaskObj = roomTaskIds[0];
																deleteRoomTask(roomTaskObj);
															}
														}}
													>
														<FontAwesome5 name="unlink" size={12} />
													</Button>
												</View>
											) : null;
										})}
							</Collapse>
						</Card>
					))}
			</ScrollView>

			<ModalContainer
				visible={modal.modals.createTask}
				onClose={() => modal.closeModal("createTask")}
			>
				<CreateTaskForm
					onSubmit={taskMutation.handleCreateTask}
					onClose={() => modal.closeModal("createTask")}
					isLoading={taskMutation.createTaskMutation.isPending}
				/>
			</ModalContainer>

			<ModalContainer
				visible={modal.modals.editTask && !!selectedTask}
				onClose={() => modal.closeModal("editTask")}
			>
				{selectedTask && (
					<EditTaskForm
						task={selectedTask}
						onSubmit={taskMutation.handleUpdateTask}
						onClose={() => modal.closeModal("editTask")}
						isLoading={taskMutation.updateTaskMutation.isPending}
					/>
				)}
			</ModalContainer>

			<ModalContainer
				visible={modal.modals.deleteTask && !!selectedTask}
				onClose={() => modal.closeModal("deleteTask")}
			>
				{selectedTask && (
					<DeleteTaskConfirm
						task={selectedTask}
						onConfirm={taskMutation.handleDeleteTask}
						onClose={() => modal.closeModal("deleteTask")}
						isLoading={taskMutation.deleteTaskMutation.isPending}
					/>
				)}
			</ModalContainer>
		</View>
	);

	const renderAssignments = () => (
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.headerContainer}>
				<Button variant="contained">
					<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
				</Button>
			</View>

			{dailyAssignments &&
				locations &&
				!dailyAssignmentsIsLoading &&
				dailyAssignments.map(assignment => {
					const location = locations.find(l => l.id === assignment.location_id);

					if (!location) return null;

					return (
						<Card key={assignment.id} style={styles.card}>
							<TouchableOpacity
								style={styles.cardHeader}
								onPress={() => toggleAssignment(assignment.id)}
							>
								<View style={styles.headerWithIcon}>
									<FontAwesome5
										name={
											expandedAssignments[assignment.id]
												? "angle-down"
												: "angle-right"
										}
										size={16}
										color={styles.collapseIcon.color}
									/>
									<Typography variant="h5">
										{t("admin.dailyAssignment")} - {location.name}
									</Typography>
								</View>
								<View style={styles.actionButtons}>
									<Button variant="outlined">
										<FontAwesome5 name="edit" size={14} />
									</Button>
									<Button variant="outlined" style={styles.deleteButton}>
										<FontAwesome5 name="trash" size={14} />
									</Button>
								</View>
							</TouchableOpacity>

							<Collapse expanded={expandedAssignments[assignment.id]}>
								<Typography variant="subtitle2">
									{t("admin.assignmentDetails")}
								</Typography>
								<Typography>
									{t("admin.date")}: {assignment.date}
								</Typography>
								{assignment.admin_note && (
									<Typography>
										{t("admin.adminNote")}: {assignment.admin_note}
									</Typography>
								)}
								{assignment.user_note && (
									<Typography>
										{t("admin.userNote")}: {assignment.user_note}
									</Typography>
								)}
							</Collapse>
						</Card>
					);
				})}
		</ScrollView>
	);

	return (
		<View style={styles.container}>
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
					<Typography
						style={[styles.tabText, activeTab === "tasks" && styles.activeTabText]}
					>
						{t("admin.tasks")}
					</Typography>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === "assignments" && styles.activeTab]}
					onPress={() => setActiveTab("assignments")}
				>
					<Typography
						style={[
							styles.tabText,
							activeTab === "assignments" && styles.activeTabText,
						]}
					>
						{t("admin.assignments")}
					</Typography>
				</TouchableOpacity>
			</View>

			{activeTab === "locations" && renderLocations()}
			{activeTab === "tasks" && renderTasks()}
			{activeTab === "assignments" && renderAssignments()}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor:
			typeof theme.colors.background === "object"
				? theme.colors.background.default
				: theme.colors.background,
	},
	tabContainer: {
		flexDirection: "row",
		backgroundColor: theme.colors.background.main,
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
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
	},
	mainButton: {
		paddingHorizontal: theme.spacing(2),
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
	roomItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
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
	assignmentItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
	},
	assignmentActions: {
		marginTop: theme.spacing(2),
		alignItems: "flex-end",
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
