// src/ui/components/reports/ReportForm.tsx
import React, { useState } from "react";
import { Image, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Card, Input, ModalContainer, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

interface Media {
	type: "image" | "video";
	uri: string;
}

interface ReportFormProps extends React.ComponentProps<typeof View> {
	taskId?: number;
	roomId?: number;
	onSubmit: (data: { text: string; media: string[] }) => Promise<void>;
	onCancel: () => void;
}

export default function ReportForm({ taskId, roomId, onCancel, onSubmit }: ReportFormProps) {
	const { t } = useTranslation();
	const [text, setText] = useState("");
	const [media, setMedia] = useState<Media[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mediaPickerVisible, setMediaPickerVisible] = useState(false);

	const handleCancel = () => {
		// Вызываем переданный обработчик отмены
		onCancel();
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

	// Обработчик для съемки изображения с камеры
	const takePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();

		if (status === "granted") {
			const result = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				quality: 0.8,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				setMedia([...media, { type: "image", uri: result.assets[0].uri }]);
			}
		}
		setMediaPickerVisible(false);
	};

	const recordVideo = async () => {
		let status;

		if (Platform.OS === "web") {
			// Специальная обработка для Web
			status = await handleWebCameraPermissions();
		} else {
			// Для мобильных устройств
			const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
			status = cameraStatus;
		}

		// Остальной код без изменений
	};

	// Дополнительная функция для Web
	const handleWebCameraPermissions = async (): Promise<string> => {
		try {
			// Реализация для Web-среды
			if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				const stream = await navigator.mediaDevices.getUserMedia({ video: true });
				stream.getTracks().forEach(track => track.stop());
				return "granted";
			}
			return "denied";
		} catch (error) {
			console.error("Web camera error:", error);
			return "denied";
		}
	};

	// Удаление медиафайла
	const removeMedia = (index: number) => {
		setMedia(media.filter((_, i) => i !== index));
	};

	// Отправка отчета
	const handleSubmit = async () => {
		// if (!text.trim() && media.length === 0) return;

		setIsSubmitting(true);
		try {
			const onlyUris = media.map(item => item.uri);
			await onSubmit({ text, media: onlyUris });
			setText("");
			setMedia([]);
		} catch (error) {
			console.error("Error submitting report:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card variant={"outlined"} style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("reports.createReport")}
			</Typography>

			<View style={styles.inputContainer}>
				<ScrollView style={styles.textInputContainer} keyboardShouldPersistTaps="handled">
					<Input
						style={styles.textInputMultiLine}
						value={text}
						onChangeText={text => setText(text)}
						placeholder={t("reports.enterReportText")}
						multiline={true}
					/>
				</ScrollView>

				{media.length > 0 && (
					<ScrollView horizontal style={styles.mediaPreviewContainer}>
						{media.map((item, index) => (
							<View key={index} style={styles.mediaPreview}>
								<Image source={{ uri: item.uri }} style={styles.previewImage} />
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => removeMedia(index)}
								>
									<FontAwesome5 name="times-circle" size={20} color="red" />
								</TouchableOpacity>
								{item.type === "video" && (
									<View style={styles.videoIndicator}>
										<FontAwesome5 name="video" size={16} color="white" />
									</View>
								)}
							</View>
						))}
					</ScrollView>
				)}

				<View style={styles.actionButtons}>
					<Button
						variant="contained"
						color="primary"
						size="medium"
						onPress={() => setMediaPickerVisible(true)}
					>
						<FontAwesome5 name="image" size={16} color={styles.iconColor} />
					</Button>
					<View style={styles.buttonsContainer}>
						<Button
							variant="outlined"
							color="secondary"
							size="medium"
							onPress={handleCancel}
						>
							{t("common.cancel")}
						</Button>

						<Button
							variant="contained"
							color="primary"
							size="medium"
							loading={isSubmitting}
							onPress={handleSubmit}
						>
							{t("reports.submit")}
						</Button>
					</View>
				</View>
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

						<Button variant="tint" color="primary" size="medium" onPress={takePhoto}>
							{t("reports.takePhoto")}
						</Button>

						<Button variant="tint" color="primary" size="medium" onPress={recordVideo}>
							{t("reports.recordVideo")}
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
		borderColor: theme.colors.border,
		borderRadius: theme.borderRadius(1),
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
		justifyContent: "space-between",
		marginTop: theme.spacing(1),
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
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
	buttonsContainer: {
		flexDirection: "row",
		gap: theme.spacing(2),
	},
}));
