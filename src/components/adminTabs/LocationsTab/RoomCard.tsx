import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../../ui/common/Typography";
import { Button, ModalContainer } from "@/ui";
import Collapse from "../../../ui/common/Collapse";
import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import { DeleteRoomConfirm, EditRoomForm } from "@/ui/forms/common/RoomForms";
import { useTranslation } from "react-i18next";
import TasksList from "@/components/lists/TasksList";

export interface RoomCardProps {
	room: RoomResponse;
	rooms: RoomResponse[];
	locations: LocationResponse[];
	tasks: TaskResponse[];
	roomTasks: RoomTaskResponse[];
	roomMutation: any;
	roomTaskMutation: any;
	roomTasksRefetch: any;
	tasksRefetch: any;
}

export default function RoomCard({
	room,
	rooms,
	locations,
	tasks,
	roomTasks,
	roomMutation,
	roomTaskMutation,
	roomTasksRefetch,
	tasksRefetch,
}: RoomCardProps) {
	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showCreateRoomTask, setShowCreateRoomTask] = useState(false);

	const romTasksFiltered = useMemo(() => {
		if (roomTasks) {
			const roomTaskIds = roomTasks
				.filter(rt => rt.room_id === room.id)
				.map(rt => rt.task_id);

			if (tasks) return tasks.filter(task => roomTaskIds.includes(task.id));
		}
		return [];
	}, []);

	const getRoomTaskId = (roomId: number, taskId: number) => {
		return roomTasks && roomTasks.filter(rt => rt.room_id === roomId && rt.task_id === taskId);
	};

	const deleteRoomTask = async (roomTask: RoomTaskResponse) => {
		await roomTaskMutation.handleDeleteRoomTask({ room_task_id: roomTask.id });
	};

	return (
		<>
			<View key={room.id} style={styles.roomSection}>
				<TouchableOpacity
					style={styles.roomHeader}
					onPress={() => setExpanded(prev => !prev)}
				>
					<View style={styles.headerWithIcon}>
						<FontAwesome5
							name={expanded ? "angle-down" : "angle-right"}
							size={14}
							color={styles.collapseIcon.color}
						/>
						<Typography>{room.name}</Typography>
					</View>
					<View style={styles.actionButtons}>
						<Button
							variant="text"
							onPress={() => {
								setShowEdit(true);
							}}
						>
							<FontAwesome5 name="edit" size={14} />
						</Button>
						<Button
							variant="text"
							style={styles.deleteButton}
							onPress={() => {
								setShowDelete(true);
							}}
						>
							<FontAwesome5 name="trash" size={14} />
						</Button>
					</View>
				</TouchableOpacity>

				<Collapse expanded={expanded}>
					<View style={styles.roomTasks}>
						<Typography variant="subtitle2">{t("admin.tasks")}</Typography>
						{romTasksFiltered.length > 0 ? (
							romTasksFiltered.map(task => (
								<View key={task.id} style={styles.roomTaskItem}>
									<Typography>{task.title}</Typography>
									<View style={styles.actionButtons}>
										<Button variant="text" style={styles.deleteButton}>
											<FontAwesome5
												name="unlink"
												size={12}
												onPress={() => {
													console.log("unlink");
													const roomTaskIds = getRoomTaskId(
														room.id,
														task.id
													);
													if (roomTaskIds && roomTaskIds.length > 0) {
														const roomTaskObj = roomTaskIds[0];
														deleteRoomTask(roomTaskObj);
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
								setShowCreateRoomTask(true);
							}}
						>
							<FontAwesome5 name="plus" size={14} />
							{t("admin.addTask")}
						</Button>
					</View>
				</Collapse>
			</View>

			<ModalContainer visible={showEdit} onClose={() => setShowEdit(false)}>
				<EditRoomForm
					onSubmit={roomMutation.handleUpdateRoom}
					onClose={() => setShowEdit(false)}
					room={room}
					isLoading={roomMutation.updateRoomMutation.isPending}
				/>
			</ModalContainer>
			<ModalContainer visible={showDelete} onClose={() => setShowDelete(false)}>
				<DeleteRoomConfirm
					room={room}
					onConfirm={roomMutation.handleDeleteRoom}
					onClose={() => setShowDelete(false)}
					isLoading={roomMutation.deleteRoomMutation.isPending}
				/>
			</ModalContainer>
			<ModalContainer
				visible={showCreateRoomTask}
				onClose={() => setShowCreateRoomTask(false)}
			>
				<TasksList
					onClose={() => setShowCreateRoomTask(false)}
					tasks={tasks}
					rooms={rooms}
					room={room}
					locations={locations}
					roomTasks={roomTasks}
					tasksRefetch={tasksRefetch}
					roomTasksRefetch={roomTasksRefetch}
				/>
			</ModalContainer>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
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
}));
