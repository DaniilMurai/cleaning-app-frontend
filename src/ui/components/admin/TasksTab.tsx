// src/ui/components/admin/TasksTab.tsx
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/common/Typography";
import { Button, Card, ModalContainer } from "@/ui";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import { CreateTaskForm, DeleteTaskConfirm, EditTaskForm } from "@/ui/forms/common/TaskForms";

interface TasksTabProps {
	tasks: TaskResponse[];
	rooms: RoomResponse[];
	locations: LocationResponse[];
	roomTasks: RoomTaskResponse[];
	taskMutation: any;
	roomTaskMutation: any;
	modal: any;
}

export default function TasksTab({
	tasks,
	rooms,
	locations,
	roomTasks,
	taskMutation,
	roomTaskMutation,
	modal,
}: TasksTabProps) {
	const { t } = useTranslation();

	// Состояния для управления развернутыми/свернутыми элементами
	const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

	const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
	// Функции для обработки состояния развернутых элементов
	const toggleTask = (id: number) => {
		setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const getRoomTaskId = (roomId: number, taskId: number) => {
		return roomTasks && roomTasks.filter(rt => rt.room_id === roomId && rt.task_id === taskId);
	};

	const deleteRoomTask = async (roomTask: RoomTaskResponse) => {
		await roomTaskMutation.handleDeleteRoomTask({ room_task_id: roomTask.id });
	};

	// Модальные окна для Task
	const renderTaskModals = () => (
		<>
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
		</>
	);

	return (
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

			{renderTaskModals()}
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
