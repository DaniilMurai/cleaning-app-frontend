import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import { Button, Card, ModalContainer } from "@/ui";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../Typography";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Collapse from "@/ui/Collapse";
import { CreateTaskForm, DeleteTaskConfirm, EditTaskForm } from "@/ui/forms/TaskForms";
import { useTranslation } from "react-i18next";
import useTaskMutation from "@/hooks/useTaskMutation";
import useRoomTaskMutation from "@/hooks/useRoomTaskMutation";

interface TasksListProps {
	onClose: () => void;
	tasks?: TaskResponse[];
	rooms?: RoomResponse[];
	room?: RoomResponse;
	locations?: LocationResponse[];
	roomTasks?: RoomTaskResponse[];
	tasksRefetch?: () => void;
	roomTasksRefetch?: () => void;
}

export default function TasksList({
	onClose,
	tasks,
	roomTasks,
	rooms,
	room,
	locations,
	tasksRefetch,
	roomTasksRefetch,
}: TasksListProps) {
	const { t } = useTranslation();

	const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
	const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});

	function useModals() {
		const [modals, setModals] = useState({
			createTask: false,
			editTask: false,
			deleteTask: false,
		});

		const openModal = (modalName: any) => {
			setModals(prev => ({ ...prev, [modalName]: true }));
		};

		const closeModal = (modalName: any) => {
			setModals(prev => ({ ...prev, [modalName]: false }));
		};

		return { modals, openModal, closeModal };
	}

	useEffect(() => {
		console.log("TasksList rendering");
	});

	const modal = useModals();

	const toggleTask = (id: number) => {
		setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const createMutationHandlers = (entityName: string, { closeModalOnSuccess = true } = {}) => ({
		onSuccessCreate: () => {
			if (closeModalOnSuccess) modal.closeModal(`create${entityName}`);
		},
		onSuccessUpdate: () => {
			if (closeModalOnSuccess) modal.closeModal(`edit${entityName}`);
		},
		onSuccessDelete: () => {
			if (closeModalOnSuccess) modal.closeModal(`delete${entityName}`);
		},
	});

	const taskMutationHandlers = {
		...createMutationHandlers("Task"),
		refetch: tasksRefetch || (() => {}),
	};

	const roomTaskMutationHandlers = {
		...createMutationHandlers("RoomTask"),
		refetch: roomTasksRefetch || (() => {}),
	};

	const taskMutation = useTaskMutation(taskMutationHandlers);
	const roomTaskMutation = useRoomTaskMutation(roomTaskMutationHandlers);

	const handleCreateRoomTask = async (task: TaskResponse, room: RoomResponse) => {
		await roomTaskMutation.handleCreateRoomTask({
			task_id: task.id,
			room_id: room.id,
		});
	};

	return (
		<Card size={"large"} style={{ flex: 1 }}>
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
						<Card key={task.id} variant="outlined" style={styles.card}>
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
											handleCreateRoomTask(task, room!).then(() =>
												roomTaskMutationHandlers.refetch()
											);
										}}
									>
										<FontAwesome5 name="link" size={14} />
									</Button>
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
													>
														<FontAwesome5 name="unlink" size={12} />
													</Button>
												</View>
											) : null;
										})}
							</Collapse>
						</Card>
					))}
				<Button variant={"contained"} style={styles.buttonExit} onPress={onClose}>
					{t("common.close")}
				</Button>
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
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		flexDirection: "row-reverse",
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
	iconColor: {
		color: theme.colors.primary.text,
	},

	assignmentItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	buttonExit: {
		alignSelf: "flex-end",
	},
}));
