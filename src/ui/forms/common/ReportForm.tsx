// src/ui/components/reports/ReportForm.tsx
import React, { JSX, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Card, Collapse, Dialog, Input, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
	AssignmentStatus,
	CreateReportReportRooms,
	DailyAssignmentForUserWithHintsResponse,
	type InventoryResponse,
} from "@/api/client";
import RoomTaskCollapse from "@/components/reports/RoomTaskCollapse";
import { formatTime } from "@/core/utils/dateUtils";
import GetStatusBadge from "@/components/reports/StatusBadge";
import { AssignmentStorage } from "@/core/auth/storage";
import { InventoryUserCreate, RoomStatus } from "@/api/admin";
import ImagePickerForm from "@/ui/forms/common/ImagePickerForm.tsx";
import Checkbox from "@/ui/common/CheckBox.tsx";
import ImageShower from "@/ui/forms/common/ImageShower.tsx";

interface Media {
	type: "image" | "video";
	uri: string;
}

interface ReportFormProps extends React.ComponentProps<typeof View> {
	assignment: DailyAssignmentForUserWithHintsResponse | null;
	onSubmit: (data: {
		text?: string;
		media?: string[];
		status: AssignmentStatus;
		reportRooms?: CreateReportReportRooms;
		inventoryUserCreate: InventoryUserCreate[];
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

	const handleInventoryCheck = (inventoryId: number, checked: boolean) => {
		const newChecked = new Set(checkedInventory);
		if (checked) {
			newChecked.add(inventoryId);
		} else {
			newChecked.delete(inventoryId);
		}
		setCheckedInventory(newChecked);
	};
	const [status, setStatus] = useState<AssignmentStatus>("completed");
	// Состояние для хранения отметок комнат всех задач
	const [tasksRoomChecks, setTasksRoomChecks] = useState<TasksRoomChecks>({});

	// Добавим в начало компонента ReportForm
	const [localAssignment, setLocalAssignment] =
		useState<DailyAssignmentForUserWithHintsResponse | null>(assignment);

	const [checkedInventory, setCheckedInventory] = useState<Set<number>>(new Set());
	const [isOpenedInventory, setIsOpenedInventory] = useState<Record<number, boolean>>({});
	const [openInventoryContainer, setOpenInventoryContainer] = useState<boolean>(false);

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
				setLocalAssignment(data);

				const checks: TasksRoomChecks = {};
				data.assigned_tasks?.forEach(task => {
					if (!checks[task.task.id]) {
						checks[task.task.id] = {};
					}
					checks[task.task.id][task.room.id] = true;
				});
				setTasksRoomChecks(checks);

				const defaultChecked =
					data.assigned_tasks?.flatMap(at => at.task.inventory.map(inv => inv.id)) || [];
				setCheckedInventory(new Set(defaultChecked));
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

			const allInventory = new Set(
				localAssignment?.assigned_tasks?.flatMap(at => at.task.inventory.map(i => i.id))
			);

			const endingInventory = allInventory.difference(checkedInventory);

			if (!localAssignment?.user_id) {
				console.error("No localAssignment?.user_id");
				return;
			}

			const inventoryUserCreate: InventoryUserCreate[] = Array.from(
				endingInventory.values().map(endingId => ({
					inventory_id: endingId,
					user_id: localAssignment.user_id,
					ending: true,
				}))
			);

			await onSubmit({
				text,
				media: onlyUris,
				status, // Передаем статус
				reportRooms,
				inventoryUserCreate,
			});

			setText("");
			setMedia([]);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderRoomTaskCollapses = () => {
		return localAssignment?.assigned_tasks?.reduce(
			(acc, at) => {
				if (!acc.seen.has(at.task.id)) {
					acc.seen.add(at.task.id);
					acc.elements.push(
						<Card variant={"standard"} style={styles.borderColor}>
							<RoomTaskCollapse
								key={at.task.id}
								rooms={localAssignment?.rooms ?? []}
								task={at.task}
								roomTasks={localAssignment?.room_tasks ?? []}
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

	const renderInventoryCollapse = () => {
		// Собираем уникальный инвентарь из всех задач
		const uniqueInventory: Map<number, InventoryResponse> = new Map();

		localAssignment?.assigned_tasks?.forEach(at => {
			at.task.inventory?.forEach(invent => {
				if (!uniqueInventory.has(invent.id)) {
					uniqueInventory.set(invent.id, invent);
				}
			});
		});
		// Если нет инвентаря, не показываем секцию
		if (uniqueInventory.size === 0) {
			return null;
		}

		return (
			<Card variant={"standard"} style={styles.inventoryMainContainer}>
				<TouchableOpacity
					style={{ flexDirection: "row", justifyContent: "space-between" }}
					onPress={() => setOpenInventoryContainer(prev => !prev)}
				>
					<View style={styles.taskContainer}>
						<View style={styles.submitIconContainer}>
							<FontAwesome5 name={"box"} color={styles.iconColor.color} size={20} />
						</View>
						<View style={styles.helpTextContainer}>
							<Typography variant={"h6"}>
								{" "}
								{t("components.inventory.title")}
							</Typography>
							<Typography variant={"subtitle2"} color={styles.dateText.color}>
								{t("components.inventory.check")}
							</Typography>
						</View>
					</View>
					<View style={{ justifyContent: "center" }}>
						<FontAwesome5
							name={openInventoryContainer ? "angle-down" : "angle-left"}
							size={26}
							color={styles.collapseIcon.color}
						/>
					</View>
				</TouchableOpacity>
				<Collapse expanded={openInventoryContainer}>
					<View style={{ gap: 12 }}>
						{Array.from(uniqueInventory.values()).map((invent: InventoryResponse) => (
							<View key={invent.id} style={styles.inventoryContainer}>
								<TouchableOpacity
									style={styles.inventoryTouchContainer}
									onPress={() =>
										setIsOpenedInventory(prev => ({
											...prev,
											[invent.id]: !prev[invent.id],
										}))
									}
								>
									<View style={styles.inventoryHeaderWithIcon}>
										<FontAwesome5
											name={
												isOpenedInventory[invent.id]
													? "angle-down"
													: "angle-right"
											}
											size={20}
											color={styles.collapseIcon.color}
										/>
										<Typography variant={"h6"}>{invent.title}</Typography>
									</View>
									<Checkbox
										color={
											checkedInventory.has(invent.id) ? "success" : "error"
										}
										size={"large"}
										checked={checkedInventory.has(invent.id)}
										onChange={checked =>
											handleInventoryCheck(invent.id, checked)
										}
									/>
								</TouchableOpacity>
								<Collapse expanded={isOpenedInventory[invent.id]}>
									<View style={{ gap: 8 }}>
										<Typography
											variant={"subtitle2"}
											color={styles.dateText.color}
										>
											{t("components.inventory.description")}
										</Typography>
										<Typography>
											{invent.description ??
												t("components.inventory.noDescription")}
										</Typography>
										<ImageShower media={invent.media_links ?? []} />
									</View>
								</Collapse>
							</View>
						))}
					</View>
				</Collapse>
			</Card>
		);
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
						onPress={onCancel}
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
						<Typography>{localAssignment?.location.name}</Typography>
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
							<Typography variant={"h6"}> {t("reports.completedTasks")}</Typography>
							<Typography variant={"subtitle2"} color={styles.dateText.color}>
								{t("reports.markCompleted")}
							</Typography>
						</View>
					</View>

					{renderRoomTaskCollapses()}
				</Card>
				{renderInventoryCollapse()}
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
								<Typography variant={"h6"}>{t("reports.reportText")}</Typography>
								<Typography color={styles.dateText.color}>
									{t("reports.addComments")}
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
	inventoryTouchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	inventoryContainer: {
		paddingHorizontal: theme.spacing(2),
		paddingVertical: theme.spacing(1),
		borderRadius: theme.borderRadius(2),
		borderWidth: 1,
		borderColor: theme.colors.border,
		// marginTop: theme.spacing(1.5),
	},
	inventoryHeaderWithIcon: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1),
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
	inventoryMainContainer: {
		borderColor: theme.colors.border,
		borderWidth: 1,
		marginTop: theme.spacing(2),
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
	collapseIcon: {
		color: theme.colors.text.primary,
	},
}));
