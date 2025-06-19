import { RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/client";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Collapse, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import Checkbox from "@/ui/common/CheckBox";
import { useTranslation } from "react-i18next";

interface Props {
	rooms: RoomResponse[];
	task: TaskResponse;
	roomTasks: RoomTaskResponse[];
	onRoomChecksChange: (taskId: number, roomChecks: Record<number, boolean>) => void;
}

export default function RoomTaskCollapse({ rooms, task, roomTasks, onRoomChecksChange }: Props) {
	const [isExpanded, setIsExpanded] = useState(false);
	const toggleExpand = () => setIsExpanded(prev => !prev);

	const { t } = useTranslation();

	const [roomChecks, setRoomChecks] = useState<Record<number, boolean>>({});

	// Фильтрация комнат для задачи
	const filteredRoomsForTask = useMemo(() => {
		if (roomTasks && rooms) {
			const roomTaskIds = roomTasks
				.filter(rt => rt.task_id === task.id)
				.map(rt => rt.room_id);

			return rooms.filter(room => roomTaskIds.includes(room.id));
		}
		return [];
	}, [roomTasks, rooms, task.id]);

	// Инициализация всех комнат как отмеченных
	useEffect(() => {
		const initialChecks: Record<number, boolean> = {};
		filteredRoomsForTask.forEach(room => {
			initialChecks[room.id] = true;
		});
		setRoomChecks(initialChecks);
	}, [filteredRoomsForTask]);

	// Определяем состояние чекбокса задачи
	const taskCheckStatus = useMemo(() => {
		const roomIds = filteredRoomsForTask.map(room => room.id);
		const total = roomIds.length;

		if (total === 0)
			return {
				checked: false,
				indeterminate: false,
				color: "primary",
			};

		const checkedCount = roomIds.filter(id => roomChecks[id]).length;

		if (checkedCount === total) {
			return {
				checked: true,
				indeterminate: false,
				color: "success",
			};
		} else if (checkedCount === 0) {
			return {
				checked: false,
				indeterminate: false,
				color: "error", // Используем error для пустого состояния
			};
		} else {
			return {
				checked: false,
				indeterminate: true,
				color: "warning",
			};
		}
	}, [filteredRoomsForTask, roomChecks]);

	// Обработчик для комнат
	const handleRoomCheckChange = (roomId: number, checked: boolean) => {
		const newChecks = { ...roomChecks, [roomId]: checked };
		setRoomChecks(newChecks);

		// Передаем изменения наружу
		if (onRoomChecksChange) {
			onRoomChecksChange(task.id, newChecks);
		}
	};

	// Обработчик для всей задачи
	const handleTaskCheckChange = () => {
		const newValue = !taskCheckStatus.checked && !taskCheckStatus.indeterminate;
		const updates: Record<number, boolean> = {};

		filteredRoomsForTask.forEach(room => {
			updates[room.id] = newValue;
		});

		setRoomChecks(prev => ({ ...prev, ...updates }));
		if (onRoomChecksChange) {
			onRoomChecksChange(task.id, { ...roomChecks, ...updates });
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.touchContainer} onPress={toggleExpand}>
				<View style={styles.headerWithIcon}>
					<FontAwesome5
						name={isExpanded ? "angle-down" : "angle-right"}
						size={20}
						color={styles.collapseIcon.color}
					/>
					<Typography variant="h5" style={styles.wrappableText} numberOfLines={0}>
						{task.title}
					</Typography>
				</View>
				<Checkbox
					size={"large"}
					color={taskCheckStatus.color as any}
					checked={taskCheckStatus.checked}
					indeterminate={taskCheckStatus.indeterminate}
					onChange={handleTaskCheckChange}
				/>
			</TouchableOpacity>
			<Collapse expanded={isExpanded}>
				<Typography
					style={{ marginTop: 12, marginBottom: 12, marginLeft: 16 }}
					variant={"subtitle1"}
				>
					{t("admin.rooms")}
				</Typography>
				<View style={styles.roomsContainer}>
					{filteredRoomsForTask.map(room => (
						<View key={room.id} style={styles.roomItem}>
							<Typography>{room.name}</Typography>
							<Checkbox
								checked={roomChecks[room.id] ?? false}
								size={"medium"}
								onChange={checked => handleRoomCheckChange(room.id, checked)}
								// label={room.name}
								color="success"
							/>
						</View>
					))}
				</View>
			</Collapse>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
	},
	touchContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},
	wrappableText: {
		flexShrink: 1,
		flexWrap: "wrap",
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerWithIcon: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	roomsContainer: {
		padding: theme.spacing(2),
		paddingLeft: theme.spacing(2),

		gap: theme.spacing(1),
	},
	roomItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingRight: theme.spacing(3),
		marginVertical: theme.spacing(0.5),
	},
}));
