import {
	HintsResponse,
	LocationResponse,
	RoomResponse,
	RoomTaskResponse,
	TaskResponse,
	TaskWithHintsResponse,
} from "@/api/admin";
import { Button, Card, Dialog } from "@/ui";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../ui/common/Typography";
import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import Collapse from "@/ui/common/Collapse";
import { useTranslation } from "react-i18next";
import useTaskMutation from "@/core/hooks/mutations/useTaskMutation";
import useRoomTaskMutation from "@/core/hooks/mutations/useRoomTaskMutation";
import useModals from "@/core/hooks/shared/useModals";
import { createMutationHandlersFactory } from "@/core/utils/mutationHandlers";
import { DialogProps } from "@/ui/common/Dialog";
import { CreateTaskForm, DeleteTaskConfirm, EditTaskForm } from "@/ui/forms/common/TaskForms";
import { CreateHintForm, EditHintForm } from "@/ui/forms/common/HintFrom.tsx";
import useHintMutation from "@/core/hooks/mutations/useHintMutation.ts";

interface TasksListProps extends DialogProps {
	tasks?: TaskWithHintsResponse[];
	rooms?: RoomResponse[];
	room?: RoomResponse;
	locations?: LocationResponse[];
	roomTasks?: RoomTaskResponse[];
}

export default function TasksListDialog({
	onClose,
	tasks,
	roomTasks,
	rooms,
	room,
	locations,

	...props
}: TasksListProps) {
	const { t } = useTranslation();

	const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
	const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
	const [selectedHint, setSelectedHint] = useState<HintsResponse | null>(null);

	// In your component
	const modal = useModals({
		createTask: false,
		editTask: false,
		deleteTask: false,
		createHint: false,
		readHint: false,
		editHint: false,
		deleteHint: false,
	});

	const toggleTask = (id: number) => {
		setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const createMutationHandlers = createMutationHandlersFactory(
		modal as {
			modals: Record<string, boolean>;
			openModal: (modalName: string | number) => void;
			closeModal: (modalName: string | number) => void;
		}
	);
	const taskMutationHandlers = createMutationHandlers("Task");

	const roomTaskMutationHandlers = createMutationHandlers("RoomTask");

	const hintMutationHandlers = createMutationHandlers("Hint");

	const hintMutation = useHintMutation(hintMutationHandlers);
	const taskMutation = useTaskMutation(taskMutationHandlers);
	const roomTaskMutation = useRoomTaskMutation(roomTaskMutationHandlers);

	const handleCreateRoomTask = async (task: TaskResponse, room: RoomResponse) => {
		await roomTaskMutation.handleCreateRoomTask({
			task_id: task.id,
			room_id: room.id,
		});
	};

	return (
		<>
			<Dialog
				{...props}
				onClose={onClose}
				card
				cardProps={{
					size: "large",
					variant: "contained",
				}}
				scrollView
				header={
					<View style={styles.headerContainer}>
						<Button
							variant="contained"
							onPress={() => {
								modal.openModal("createTask");
							}}
						>
							<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
							{/*+*/}
						</Button>
					</View>
				}
				actions={
					<Button variant={"outlined"} style={styles.buttonExit} onPress={onClose}>
						{t("common.close")}
					</Button>
				}
			>
				{tasks?.map(task => {
					const isAlreadyInRoom = roomTasks?.find(
						rt => rt.task_id === task.id && rt.room_id === room?.id
					);

					return (
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
									<Typography variant="h5" style={styles.cartTitle}>
										{task.title}
									</Typography>
								</View>
								<View style={styles.actionButtonsWrapper}>
									<View style={styles.actionButtons}>
										<Button
											variant={"outlined"}
											onPress={() => {
												setSelectedTask(task);
												modal.openModal("createHint");
											}}
											style={{
												width: 36,
												height: 36,
												alignItems: "center",
											}}
										>
											<FontAwesome5 name={"lightbulb"} size={16} />
										</Button>
										<Button
											variant="outlined"
											onPress={() => {
												setSelectedTask(task);
												handleCreateRoomTask(task, room!).then(
													() => roomTaskMutationHandlers.onSuccessCreate
												);
											}}
											disabled={!!isAlreadyInRoom}
										>
											{/*Добавить*/}
											<FontAwesome5 name="link" size={14} />
										</Button>
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
								</View>
							</TouchableOpacity>

							<Collapse expanded={expandedTasks[task.id]}>
								<Typography>
									{task.description || t("common.noDescription")}
								</Typography>
								<Typography variant="h5">
									{t("admin.frequency")}:{" "}
									{task.frequency === 1
										? t("admin.everyAssignment")
										: task.frequency >= 2 && task.frequency <= 4
											? t("admin.everyXAssignments.twoFour", {
													count: task.frequency,
												})
											: t("admin.everyXAssignments.other", {
													count: task.frequency,
												})}
								</Typography>

								{task.hints.length > 0 ? (
									<View>
										<View style={styles.divider} />
										<View style={styles.hintsContainer}>
											<Typography variant={"h6"}>
												{t("hints.title")}
											</Typography>
											<View style={styles.hintsButtonContainer}>
												{task.hints.map(hint => (
													<Button
														variant={"tint"}
														onPress={() => {
															setSelectedTask(task);
															setSelectedHint(hint);
															modal.openModal("editHint");
														}}
													>
														<FontAwesome5
															name={"lightbulb"}
															size={14}
														/>{" "}
														{hint.title}
													</Button>
												))}
											</View>
										</View>
									</View>
								) : null}
								<View style={styles.divider} />
								<Typography variant="subtitle2">
									{t("admin.assignedRooms")}
								</Typography>

								{rooms &&
									locations &&
									roomTasks &&
									(() => {
										const assignedRoomTask = roomTasks.filter(
											rt => rt.task_id === task.id
										);

										if (assignedRoomTask.length === 0) {
											return (
												<Typography style={styles.noRoomsAssignedText}>
													{"  "}
													{t("admin.noAssignments")}
												</Typography>
											);
										}

										return assignedRoomTask.map(roomTask => {
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
										});
									})()}
							</Collapse>
						</Card>
					);
				})}
			</Dialog>
			{modal.modals.createHint && selectedTask && (
				<CreateHintForm
					isVisible={modal.modals.createHint}
					onClose={() => modal.closeModal("createHint")}
					onSubmit={hintMutation.handleCreateHint}
					isLoading={hintMutation.createHintMutation.isPending}
					taskId={selectedTask?.id}
					taskTitle={selectedTask?.title}
				/>
			)}

			{modal.modals.editHint && selectedHint && (
				<EditHintForm
					taskTitle={selectedTask?.title || ""}
					isVisible={modal.modals.editHint}
					onClose={() => modal.closeModal("editHint")}
					onSubmitEdit={hintMutation.handleUpdateHint}
					isLoading={hintMutation.updateHintMutation.isPending}
					onSubmitDelete={hintMutation.handleDeleteHint}
					hint={selectedHint}
				/>
			)}

			<Dialog
				visible={modal.modals.createTask}
				onClose={() => modal.closeModal("createTask")}
				maxWidth={"xs"}
			>
				<CreateTaskForm
					onSubmit={taskMutation.handleCreateTask}
					onClose={() => modal.closeModal("createTask")}
					isLoading={taskMutation.createTaskMutation.isPending}
				/>
			</Dialog>

			<Dialog
				visible={modal.modals.editTask && !!selectedTask}
				onClose={() => modal.closeModal("editTask")}
				maxWidth={"xs"}
			>
				{selectedTask && (
					<EditTaskForm
						task={selectedTask}
						onSubmit={taskMutation.handleUpdateTask}
						onClose={() => modal.closeModal("editTask")}
						isLoading={taskMutation.updateTaskMutation.isPending}
					/>
				)}
			</Dialog>

			<Dialog
				visible={modal.modals.deleteTask && !!selectedTask}
				onClose={() => modal.closeModal("deleteTask")}
				maxWidth={"xs"}
			>
				{selectedTask && (
					<DeleteTaskConfirm
						task={selectedTask}
						onConfirm={taskMutation.handleDeleteTask}
						onClose={() => modal.closeModal("deleteTask")}
						isLoading={taskMutation.deleteTaskMutation.isPending}
					/>
				)}
			</Dialog>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	cardContainer: {
		backgroundColor: theme.colors.background.main,
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
		flexWrap: "wrap",
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
	cartTitle: {
		flexShrink: 1,
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
	noRoomsAssignedText: {
		color: theme.colors.disabled.text,
		fontStyle: "italic",
	},
	hintsButtonContainer: {
		flexDirection: "row",
		gap: theme.spacing(1),
		flexWrap: "wrap",
		justifyContent: "center",
	},
	hintsContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	actionButtonsWrapper: {
		flexDirection: "column",
		gap: theme.spacing(1),
		flexWrap: "wrap",
	},
}));
