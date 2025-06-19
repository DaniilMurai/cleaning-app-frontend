import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../../../ui/common/Typography";
import { Button } from "@/ui";
import Collapse from "../../../../ui/common/Collapse";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";

export interface RoomCardHeaderProps {
	room: RoomResponse;
	tasks: TaskResponse[];
	roomTasks: RoomTaskResponse[];
	onEdit: () => void;
	onDelete: () => void;
	onAddTask: () => void;
	onUnlinkTask: (taskId: number) => void;
}

export default function RoomCardHeader({
	room,
	tasks,
	roomTasks,
	onEdit,
	onDelete,
	onAddTask,
	onUnlinkTask,
}: RoomCardHeaderProps) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = React.useState(false);

	const roomTasksFiltered = useMemo(() => {
		if (!roomTasks || !tasks) return [];

		const roomTaskIds = roomTasks.filter(rt => rt.room_id === room.id).map(rt => rt.task_id);

		return tasks.filter(task => roomTaskIds.includes(task.id));
	}, [roomTasks, tasks, room.id]);

	return (
		<View key={room.id} style={styles.roomSection}>
			<TouchableOpacity style={styles.roomHeader} onPress={() => setExpanded(prev => !prev)}>
				<View style={styles.headerWithIcon}>
					<FontAwesome5
						name={expanded ? "angle-down" : "angle-right"}
						size={14}
						color={styles.collapseIcon.color}
					/>
					<Typography>{room.name}</Typography>
				</View>
				<View style={styles.actionButtons}>
					<Button variant="text" onPress={onEdit}>
						<FontAwesome5 name="edit" size={14} />
					</Button>
					<Button variant="text" style={styles.deleteButton} onPress={onDelete}>
						<FontAwesome5 name="trash" size={14} />
					</Button>
				</View>
			</TouchableOpacity>

			<Collapse expanded={expanded}>
				<View style={styles.roomTasks}>
					<Typography variant="subtitle2">{t("admin.tasks")}</Typography>
					{roomTasksFiltered.length > 0 ? (
						roomTasksFiltered.map(task => (
							<View key={task.id} style={styles.roomTaskItem}>
								<Typography>{task.title}</Typography>
								<View style={styles.actionButtons}>
									<Button
										variant="text"
										style={styles.deleteButton}
										onPress={() => onUnlinkTask(task.id)}
									>
										<FontAwesome5 name="unlink" size={12} />
									</Button>
								</View>
							</View>
						))
					) : (
						<Typography style={styles.emptyState}>
							{t("admin.noAssignments")}
						</Typography>
					)}
					<Button variant="text" style={styles.addButton} onPress={onAddTask}>
						<FontAwesome5 name="plus" size={14} /> {t("admin.addTask")}
					</Button>
				</View>
			</Collapse>
		</View>
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
