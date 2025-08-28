// src/ui/components/reports/ReportForm.tsx
import React, { JSX, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Card, Dialog, Input, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
	AssignmentStatus,
	CreateReportReportRooms,
	DailyAssignmentForUserResponse,
} from "@/api/client";
import RoomTaskCollapse from "@/components/reports/RoomTaskCollapse";
import { formatTime } from "@/core/utils/dateUtils";
import GetStatusBadge from "@/components/reports/StatusBadge";
import { AssignmentStorage } from "@/core/auth/storage";
import { RoomStatus } from "@/api/admin";
import ImagePickerForm from "@/ui/forms/common/ImagePickerForm.tsx";

interface Media {
	type: "image" | "video";
	uri: string;
}

interface ReportFormProps extends React.ComponentProps<typeof View> {
	assignment: DailyAssignmentForUserResponse | null;
	onSubmit: (data: {
		text?: string;
		media?: string[];
		status: AssignmentStatus;
		reportRooms?: CreateReportReportRooms;
	}) => Promise<void>;
	onCancel: () => void;
	totalTime: number;
	isVisible: boolean;
}

type TasksRoomChecks = Record<number, Record<number, boolean>>;

interface RoomsCountStatus {
	total: number;
	done: number;
}

export default function ReportForm({
	assignment,
	onCancel,
	onSubmit,
	totalTime,
	isVisible,
}: ReportFormProps) {
	const { t } = useTranslation();
	const [text, setText] = useState("");
	const [media, setMedia] = useState<Media[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [status, setStatus] = useState<AssignmentStatus>("completed");
	// Состояние для хранения отметок комнат всех задач
	const [tasksRoomChecks, setTasksRoomChecks] = useState<TasksRoomChecks>({});

	// Добавим в начало компонента ReportForm
	const [localAssignmentAndReport, setLocalAssignmentAndReport] =
		useState<DailyAssignmentForUserResponse | null>(assignment);

	console.log("assignedTasks in ReportForm: ", localAssignmentAndReport?.assigned_tasks);
	const handleCancel = () => {
		// Вызываем переданный обработчик отмены
		onCancel();
	};

	useEffect(() => {
		const init = async () => {
			let data = assignment;
			if (!data) {
				try {
					const saved = await AssignmentStorage.get();
					if (saved) data = JSON.parse(saved);
				} catch (e) {
					console.error("Storage load error", e);
				}
			}

			if (data) {
				setLocalAssignmentAndReport(data);
				const checks: TasksRoomChecks = {};

				data.assigned_tasks?.forEach(task => {
					if (!checks[task.task.id]) {
						checks[task.task.id] = {};
					}
					checks[task.task.id][task.room.id] = true;
				});

				console.log("data: ", data);
				console.log("Data assigned tasks: ", data.assigned_tasks);

				setTasksRoomChecks(checks);
			}
		};

		init();
	}, [assignment]);

	// Обработчик изменений в комнатах
	const handleRoomChecksChange = (taskId: number, roomChecks: Record<number, boolean>) => {
		setTasksRoomChecks(prev => ({
			...prev,
			[taskId]: roomChecks,
		}));
	};

	useEffect(() => {
		const status = getStatus();
		setStatus(status);
	}, [tasksRoomChecks]);

	const getStatus = () => {
		// Определяем общий статус выполнения
		const allTasksDone = Object.values(tasksRoomChecks).every(taskChecks =>
			Object.values(taskChecks).every(checked => checked)
		);

		const someTasksDone = Object.values(tasksRoomChecks).some(taskChecks =>
			Object.values(taskChecks).some(checked => checked)
		);

		let status: AssignmentStatus = "not_completed";
		if (allTasksDone) {
			status = "completed";
		} else if (someTasksDone) {
			status = "partially_completed";
		}
		return status;
	};

	// При отправке определяем статус
	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			const status = getStatus();
			console.log("submitting status: " + status);

			const onlyUris = media.map(item => item.uri);

			const uniqueRoomsStatuses: Record<string, RoomsCountStatus> = {};

			Object.keys(tasksRoomChecks).forEach(taskId => {
				const rooms = tasksRoomChecks[Number(taskId)];

				Object.keys(rooms).forEach((roomId: string) => {
					if (!uniqueRoomsStatuses[roomId]) {
						uniqueRoomsStatuses[roomId] = { total: 0, done: 0 };
					}
					uniqueRoomsStatuses[roomId].total += 1;
					if (rooms[Number(roomId)]) {
						uniqueRoomsStatuses[roomId].done += 1;
					}
				});
			});

			const reportRooms: CreateReportReportRooms = [];

			Object.entries(uniqueRoomsStatuses).forEach(([roomId, { total, done }]) => {
				let roomStatus: RoomStatus;
				if (!done) {
					roomStatus = RoomStatus.not_done;
				} else if (done === total) {
					roomStatus = RoomStatus.done;
				} else {
					roomStatus = RoomStatus.partially_done;
				}
				reportRooms.push({ room_id: Number(roomId), status: roomStatus });
			});

			console.log("reportRooms: ", reportRooms);
			await onSubmit({
				text,
				media: onlyUris,
				status, // Передаем статус
				reportRooms,
			});

			setText("");
			setMedia([]);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderRoomTaskCollapses = () => {
		return localAssignmentAndReport?.assigned_tasks?.reduce(
			(acc, at) => {
				if (!acc.seen.has(at.task.id)) {
					acc.seen.add(at.task.id);
					acc.elements.push(
						<Card variant={"standard"} style={styles.borderColor}>
							<RoomTaskCollapse
								key={at.task.id}
								rooms={localAssignmentAndReport?.rooms ?? []}
								task={at.task}
								roomTasks={localAssignmentAndReport?.room_tasks ?? []}
								onRoomChecksChange={handleRoomChecksChange}
							/>
						</Card>
					);
				}
				return acc;
			},
			{ seen: new Set(), elements: [] as JSX.Element[] }
		).elements;
	};

	return (
		<Dialog
			visible={isVisible}
			onClose={onCancel}
			maxWidth={"md"}
			fullWidth
			cardProps={{ variant: "outlined" }}
			card
			scrollView={true}
			scrollViewProps={{ contentContainerStyle: styles.scrollViewContent }}
			actions={
				<View style={styles.actionButtons}>
					<Button
						style={styles.ButtonAction}
						variant="outlined"
						color="secondary"
						size="medium"
						onPress={handleCancel}
					>
						<FontAwesome5 name="times" size={16} color={styles.iconColorCancel.color} />
						{"  "}
						{t("common.cancel")}
					</Button>

					<Button
						variant="contained"
						color="primary"
						style={styles.ButtonAction}
						size="medium"
						loading={isSubmitting}
						onPress={handleSubmit}
					>
						<FontAwesome5 name="check" size={16} color={styles.iconColorSubmit.color} />
						{"  "}
						{t("reports.submit")}
					</Button>
				</View>
			}
		>
			<View
				style={{ flexShrink: 1 }}
				// contentContainerStyle={styles.scrollViewContent}
			>
				<View style={styles.headerContainer}>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Typography>{localAssignmentAndReport?.location.name}</Typography>
						<GetStatusBadge status={status} />
					</View>
					<Typography color={styles.dateText.color}>
						<FontAwesome5 name={"clock"} size={16} />
						{"  "}
						{t("components.reportsTable.duration") + ": "}
						{formatTime(totalTime)}
					</Typography>
				</View>
				<Card variant={"standard"} style={styles.borderColor}>
					<View style={styles.taskContainer}>
						<View style={styles.submitIconContainer}>
							<FontAwesome5 name={"check"} color={styles.iconColor.color} size={20} />
						</View>
						<View style={styles.helpTextContainer}>
							<Typography variant={"h6"}>Выполненные задания</Typography>
							<Typography variant={"subtitle2"} color={styles.dateText.color}>
								Отметьте выполненные задачи и комнаты
							</Typography>
						</View>
					</View>

					{renderRoomTaskCollapses()}
				</Card>
				<View style={styles.inputContainer}>
					<Card variant={"standard"} style={styles.borderColor}>
						<View style={styles.taskContainer}>
							<View style={styles.mediaIconContainer}>
								<FontAwesome5
									name="file-alt"
									size={20}
									color={styles.mediaIconColor.color}
								/>
							</View>
							<View style={styles.helpTextContainer}>
								<Typography variant={"h6"}>Текст отчета</Typography>
								<Typography color={styles.dateText.color}>
									Добавьте дополнительные комментарии о выполнении задач
								</Typography>
							</View>
						</View>
						<ScrollView
							style={styles.textInputContainer}
							keyboardShouldPersistTaps="handled"
						>
							<Input
								variant={"filled"}
								style={styles.textInputMultiLine}
								value={text}
								size={"large"}
								onChangeText={text => setText(text)}
								placeholder={t("reports.enterReportText")}
								multiline={true}
							/>
						</ScrollView>
					</Card>
					<ImagePickerForm externalMedia={media} onChange={m => setMedia(m)} />
				</View>
			</View>
		</Dialog>
	);
}

const styles = StyleSheet.create(theme => ({
	scrollViewContent: {
		// flex: 1,
		flexGrow: 1,
		gap: theme.spacing(3),
	},
	dateText: {
		color: theme.colors.text.disabled,
		flexWrap: "wrap",
		flexShrink: 1,
	},
	helpTextContainer: {
		flexWrap: "wrap",
		flexShrink: 1,
	},
	borderColor: {
		borderColor: theme.colors.border,
		borderWidth: 1,
	},
	mediaContainer: {
		padding: theme.spacing(2),
		alignItems: "center",
		justifyContent: "center",
		borderColor: theme.colors.border,
		borderWidth: 1,
		gap: theme.spacing(2),
		borderRadius: theme.borderRadius(2),
	},
	headerContainer: {
		padding: theme.spacing(3),
		gap: theme.spacing(1),
		backgroundColor: theme.colors.primary.mainOpacity,
		borderRadius: theme.borderRadius(2),
		borderWidth: 1,
		borderColor: theme.colors.border,
		marginBottom: theme.spacing(2),
	},
	taskContainer: {
		flexDirection: "row",
		gap: theme.spacing(2),
	},
	submitIconContainer: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.primary.mainOpacity,
		justifyContent: "center",
		alignItems: "center",
	},
	mediaIconContainer: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.progress.background,
		justifyContent: "center",
		alignItems: "center",
	},
	mediaIconColor: {
		color: theme.colors.progress.main,
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	inputContainer: {
		gap: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
	textInputContainer: {
		maxHeight: 200,
	},
	textInputMultiLine: {
		width: "100%",
		minHeight: 100,
		borderWidth: 1,
		textAlignVertical: "top",
		backgroundColor: theme.colors.background.default,
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius(2),
		padding: theme.spacing(1),
		fontSize: 16,
	},
	mediaPreviewContainer: {
		flexDirection: "row",
		marginVertical: theme.spacing(1),
	},
	mediaPreview: {
		width: 100,
		height: 100,
		marginRight: theme.spacing(1),
		borderRadius: theme.borderRadius(1),
		overflow: "hidden",
		position: "relative",
	},
	previewImage: {
		width: "100%",
		height: "100%",
	},
	removeButton: {
		position: "absolute",
		top: 5,
		right: 5,
		backgroundColor: "rgba(255,255,255,0.7)",
		borderRadius: 15,
		padding: 2,
	},
	videoIndicator: {
		position: "absolute",
		bottom: 5,
		left: 5,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 12,
		padding: 4,
	},
	actionButtons: {
		flexDirection: "row",
		marginTop: theme.spacing(1),
		gap: theme.spacing(2),
		alignContent: "center",
	},
	ButtonAction: {
		flex: 1,

		alignItems: "center",
	},
	mediaPickerCard: {
		padding: theme.spacing(2),
	},
	mediaPickerTitle: {
		textAlign: "center",
		marginBottom: theme.spacing(2),
	},
	mediaOptions: {
		gap: theme.spacing(1.5),
		marginBottom: theme.spacing(2),
	},
	cancelButton: {
		marginTop: theme.spacing(1),
		alignSelf: "flex-end",
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
	iconColorSubmit: {
		color: theme.colors.primary.text,
	},
	iconColorCancel: {
		color: theme.colors.secondary.main,
	},
	buttonsContainer: {
		flexDirection: "row",
		gap: theme.spacing(2),
		flex: 1,
	},
}));
