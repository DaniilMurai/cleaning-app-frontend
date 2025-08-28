import { ScrollView, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Card, Typography } from "@/ui";
import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import * as ImagePicker from "expo-image-picker";
import ImageItemWrapper from "@/ui/forms/common/ImageItemWrapper.tsx";
import { useTranslation } from "react-i18next";

export interface Media {
	type: "image" | "video";
	uri: string;
}

interface ImagePickerFormProps {
	externalMedia: Media[];
	onChange: (media: Media[]) => void;
}

export default function ImagePickerForm({ externalMedia, onChange }: ImagePickerFormProps) {
	const { t } = useTranslation();
	const [media, setMedia] = useState<Media[]>(externalMedia);

	// Обработчик для выбора изображения из галереи
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 0.8,
			base64: false,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			console.log(result.assets[0]);
			onChange([...media, { type: "image", uri: result.assets[0].uri }]);
			setMedia([...media, { type: "image", uri: result.assets[0].uri }]);
		}
		// setMediaPickerVisible(false);
	};

	// Удаление медиафайла
	const removeMedia = (index: number) => {
		onChange(media.filter((_, i) => i !== index));
		setMedia(media.filter((_, i) => i !== index));
	};

	return (
		<Card variant={"standard"} style={styles.borderColor}>
			<View style={styles.taskContainer}>
				<View style={styles.mediaIconContainer}>
					<FontAwesome5 name="image" size={20} color={styles.mediaIconColor.color} />
				</View>
				<View style={styles.helpTextContainer}>
					<Typography variant={"h6"}>{t("media.photos")}</Typography>
					<Typography color={styles.dateText.color}>
						{t("media.youCanAddPhotos")}
					</Typography>
				</View>
			</View>

			<TouchableOpacity style={styles.mediaContainer} onPress={pickImage}>
				<FontAwesome5 name={"share-square"} size={30} color={styles.dateText.color} />
				<Typography variant={"body1"}>{t("media.addPhotos")}</Typography>
				<Typography variant={"body2"} color={styles.dateText.color}>
					{t("media.dragOrSelect")}
				</Typography>
			</TouchableOpacity>

			{media.length > 0 && (
				<ScrollView horizontal style={styles.mediaPreviewContainer}>
					{media.map((item, idx) => (
						<View key={idx} style={styles.mediaPreview}>
							<ImageItemWrapper
								uri={item.uri}
								images={media.map(m => m.uri)}
								index={idx}
							>
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => removeMedia(idx)}
								>
									<FontAwesome5 name="times-circle" size={20} color="red" />
								</TouchableOpacity>
							</ImageItemWrapper>

							{item.type === "video" && (
								<View style={styles.videoIndicator}>
									<FontAwesome5 name="video" size={16} color="white" />
								</View>
							)}
						</View>
					))}
				</ScrollView>
			)}
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
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

	taskContainer: {
		flexDirection: "row",
		gap: theme.spacing(2),
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
}));
