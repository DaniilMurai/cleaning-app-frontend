// src/ui/components/reports/ReportForm.tsx
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Card, Input, ModalContainer, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { type AssignmentReportResponse, AssignmentStatus } from "@/api/client";
import RoomTaskCollapse from "@/components/reports/RoomTaskCollapse";
import { formatTime } from "@/core/utils/dateUtils";
import GetStatusBadge from "@/components/reports/StatusBadge";

interface Media {
	type: "image" | "video";
	uri: string;
}

interface ReportFormProps extends React.ComponentProps<typeof View> {
	assignmentAndReport: AssignmentReportResponse | null;
	onSubmit: (data: {
		text?: string;
		media?: string[];
		status: AssignmentStatus;
	}) => Promise<void>;
	onCancel: () => void;
	totalTime: number;
}

type TasksRoomChecks = Record<number, Record<number, boolean>>;

export default function ReportForm({
	assignmentAndReport,
	onCancel,
	onSubmit,
	totalTime,
}: ReportFormProps) {
	const { t } = useTranslation();
	const [text, setText] = useState("");
	const [media, setMedia] = useState<Media[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mediaPickerVisible, setMediaPickerVisible] = useState(false);

	const [status, setStatus] = useState<AssignmentStatus>("completed");
	// Состояние для хранения отметок комнат всех задач
	const [tasksRoomChecks, setTasksRoomChecks] = useState<TasksRoomChecks>({});

	const handleCancel = () => {
		// Вызываем переданный обработчик отмены
		onCancel();
	};

	useEffect(() => {
		if (assignmentAndReport) {
			const initialChecks: TasksRoomChecks = {};

			assignmentAndReport.assignment.tasks?.forEach(task => {
				initialChecks[task.id] = {};

				// Инициализируем все комнаты как выполненные
				const roomIds = assignmentAndReport.assignment.room_tasks
					?.filter(rt => rt.task_id === task.id)
					.map(rt => rt.room_id);

				roomIds?.forEach(roomId => {
					initialChecks[task.id][roomId] = true;
				});
			});

			setTasksRoomChecks(initialChecks);
		}
	}, [assignmentAndReport]);

	// Обработчик изменений в комнатах
	const handleRoomChecksChange = (taskId: number, roomChecks: Record<number, boolean>) => {
		setTasksRoomChecks(prev => ({
			...prev,
			[taskId]: roomChecks,
		}));
	};
	// Обработчик для выбора изображения из галереи
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.8,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setMedia([...media, { type: "image", uri: result.assets[0].uri }]);
		}
		setMediaPickerVisible(false);
	};

	// Удаление медиафайла
	const removeMedia = (index: number) => {
		setMedia(media.filter((_, i) => i !== index));
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

		// let status = "not_completed";
		// Если пользователь вообще не сможет сделать задагние нужно будет поставить это
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
			await onSubmit({
				text,
				media: onlyUris,
				status, // Передаем статус
			});

			setText("");
			setMedia([]);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card variant={"outlined"} style={styles.container}>
			<ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollViewContent}>
				<View style={styles.headerContainer}>
					<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Typography>{assignmentAndReport?.assignment.location.name}</Typography>
						<GetStatusBadge status={status} />
					</View>
					<Typography color={styles.dateText.color}>
						<FontAwesome5 name={"clock"} size={16} />
						{"  "}
						{t("components.reportsTable.duration") + ": "}
						{formatTime(totalTime)}
					</Typography>
				</View>
				<Card variant={"default"} style={styles.borderColor}>
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

					{assignmentAndReport?.assignment.tasks?.map(task => (
						<Card variant={"default"} style={styles.borderColor}>
							<RoomTaskCollapse
								key={task.id}
								rooms={assignmentAndReport?.assignment.rooms ?? []}
								task={task}
								roomTasks={assignmentAndReport?.assignment.room_tasks ?? []}
								onRoomChecksChange={handleRoomChecksChange}
							/>
						</Card>
					))}
				</Card>
				<View style={styles.inputContainer}>
					<Card variant={"default"} style={styles.borderColor}>
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
								onChangeText={text => setText(text)}
								placeholder={t("reports.enterReportText")}
								multiline={true}
							/>
						</ScrollView>
					</Card>

					<Card variant={"default"} style={styles.borderColor}>
						<View style={styles.taskContainer}>
							<View style={styles.mediaIconContainer}>
								<FontAwesome5
									name="image"
									size={20}
									color={styles.mediaIconColor.color}
								/>
							</View>
							<View style={styles.helpTextContainer}>
								<Typography variant={"h6"}>Фото для отчета</Typography>
								<Typography color={styles.dateText.color}>
									Добавьте фотографии выполненной работы
								</Typography>
							</View>
						</View>
						<TouchableOpacity style={styles.mediaContainer} onPress={pickImage}>
							<FontAwesome5
								name={"share-square"}
								size={30}
								color={styles.dateText.color}
							/>
							<Typography variant={"body1"}>Добавить фотографии</Typography>

							<Typography variant={"body2"} color={styles.dateText.color}>
								Перетащите файлы сюда или нажмите для выбора
							</Typography>
						</TouchableOpacity>
						{media.length > 0 && (
							<ScrollView horizontal style={styles.mediaPreviewContainer}>
								{media.map((item, index) => (
									<View key={index} style={styles.mediaPreview}>
										<Image
											source={{ uri: item.uri }}
											style={styles.previewImage}
										/>
										<TouchableOpacity
											style={styles.removeButton}
											onPress={() => removeMedia(index)}
										>
											<FontAwesome5
												name="times-circle"
												size={20}
												color="red"
											/>
										</TouchableOpacity>
										{item.type === "video" && (
											<View style={styles.videoIndicator}>
												<FontAwesome5
													name="video"
													size={16}
													color="white"
												/>
											</View>
										)}
									</View>
								))}
							</ScrollView>
						)}
					</Card>
				</View>
			</ScrollView>

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

			{/* Модальное окно для выбора типа медиа */}
			<ModalContainer
				visible={mediaPickerVisible}
				onClose={() => setMediaPickerVisible(false)}
			>
				<Card style={styles.mediaPickerCard}>
					<Typography variant="h5" style={styles.mediaPickerTitle}>
						{t("reports.selectMediaType")}
					</Typography>

					<View style={styles.mediaOptions}>
						<Button variant="tint" color="primary" size="medium" onPress={pickImage}>
							{t("reports.chooseFromGallery")}
						</Button>
					</View>

					<Button
						variant="outlined"
						color="secondary"
						size="medium"
						onPress={() => setMediaPickerVisible(false)}
						style={styles.cancelButton}
					>
						{t("common.cancel")}
					</Button>
				</Card>
			</ModalContainer>
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(2),
		marginVertical: theme.spacing(2),
		maxHeight: "85%",
		height: "85%",

		margin: "auto",
		backgroundColor: theme.colors.background.default,
	},
	scrollViewContent: {
		flex: 1,
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
