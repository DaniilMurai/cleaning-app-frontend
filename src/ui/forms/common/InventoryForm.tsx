import { Button, Dialog, Input, Typography } from "@/ui";
import React, { useState } from "react";
import {
	DeleteInventoryParams,
	InventoryCreate,
	InventoryResponse,
	InventoryUpdate,
	UpdateInventoryParams,
} from "@/api/admin";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ImagePickerForm from "@/ui/forms/common/ImagePickerForm.tsx";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface Media {
	type: "image" | "video";
	uri: string;
}

interface CreateInventoryProps {
	taskTitle: string;
	taskId: number;
	isVisible: boolean;
	onClose: () => void;
	onSubmit: (inventoryData: InventoryCreate) => void;
	isLoading: boolean;
}

export const CreateInventoryForm = ({
	taskTitle,
	taskId,
	isVisible,
	onClose,
	onSubmit,
	isLoading,
}: CreateInventoryProps) => {
	const { t } = useTranslation();
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [media, setMedia] = useState<Media[]>([]);

	const mediaLinks = media.map(item => item.uri);

	return (
		<Dialog
			visible={isVisible}
			onClose={onClose}
			card
			fullWidth
			scrollView
			actions={
				<View style={styles.actionButtonsCreate}>
					<Button
						onPress={onClose}
						style={styles.ButtonAction}
						variant={"outlined"}
						color={"secondary"}
					>
						<FontAwesome5 name="times" size={16} color={styles.iconColorCancel.color} />
						{"  "}
						{t("common.close")}
					</Button>
					<Button
						onPress={() =>
							onSubmit({
								task_id: taskId,
								title: title,
								description: description,
								media_links: mediaLinks,
							})
						}
						loading={isLoading}
						variant={"contained"}
						style={styles.ButtonAction}
					>
						<FontAwesome5 name="check" size={16} color={styles.iconColorSubmit.color} />
						{"  "}
						{t("common.create")}
					</Button>
				</View>
			}
			header={
				<Typography variant={"h5"}>
					{t("components.inventory.titleForTask", { taskTitle })}
				</Typography>
			}
		>
			<View style={styles.cardContainer}>
				<Input
					label={t("components.tasksList.title")}
					value={title}
					onChangeText={e => setTitle(e)}
				/>
				<Input
					label={t("components.tasksList.description")}
					value={description}
					multiline={true}
					numberOfLines={6}
					style={{ height: 120 }}
					textAlignVertical="top"
					onChangeText={e => setDescription(e)}
				/>

				<ImagePickerForm externalMedia={media} onChange={m => setMedia(m)} />
			</View>
		</Dialog>
	);
};

interface EditInventoryFormProps {
	taskTitle: string;
	inventory: InventoryResponse;
	isVisible: boolean;
	onClose: () => void;
	onSubmitEdit: (inventory_id: UpdateInventoryParams, inventoryData: InventoryUpdate) => void;
	isLoading: boolean;
	onSubmitDelete: (inventory_id: DeleteInventoryParams) => void;
}

export function EditInventoryForm({
	taskTitle,
	inventory,
	isVisible,
	onClose,
	isLoading,
	onSubmitEdit,
	onSubmitDelete,
}: EditInventoryFormProps) {
	const { t } = useTranslation();
	const [title, setTitle] = useState<string>(inventory.title || "");
	const [description, setDescription] = useState<string>(inventory.description || "");
	const mediaWithMockType: Media[] | undefined = inventory.media_links?.map(media => ({
		type: "image",
		uri: media,
	}));
	const [media, setMedia] = useState<Media[] | undefined>(mediaWithMockType);

	return (
		<Dialog
			visible={isVisible}
			onClose={onClose}
			card
			fullWidth
			cardProps={{ variant: "outlined", style: styles.cardContainer }}
			scrollView
			actions={
				<View style={styles.actionButtonsCreate}>
					<Button
						onPress={onClose}
						variant={"outlined"}
						color={"secondary"}
						style={styles.ButtonAction}
					>
						<FontAwesome5 name="times" size={16} color={styles.iconColorCancel.color} />
						{"  "}
						{t("common.close")}
					</Button>
					<Button
						onPress={() =>
							onSubmitEdit(
								{ inventory_id: inventory.id },
								{
									task_id: inventory.task_id,
									title: title,
									description: description,
									media_links: media?.map(item => item.uri),
								}
							)
						}
						loading={isLoading}
						variant={"contained"}
						style={styles.ButtonAction}
					>
						<FontAwesome5 name="check" size={16} color={styles.iconColorSubmit.color} />
						{"  "}
						{t("common.edit")}
					</Button>
				</View>
			}
			header={
				<View style={styles.headerContainer}>
					<Typography variant={"h6"}>
						{t("components.inventory.titleForTask", { taskTitle })}
					</Typography>
					<Button
						variant={"outlined"}
						color={"secondary"}
						onPress={() => onSubmitDelete({ inventory_id: inventory.id })}
					>
						<FontAwesome5 name={"trash"} size={14} />
					</Button>
				</View>
			}
		>
			<View style={styles.cardContainer}>
				<Input
					label={t("components.tasksList.title")}
					value={title}
					onChangeText={e => setTitle(e)}
				/>
				<Input
					label={t("components.tasksList.description")}
					value={description}
					multiline={true}
					textAlignVertical="top"
					style={{ height: 120 }}
					numberOfLines={6}
					onChangeText={e => setDescription(e)}
				/>
				<ImagePickerForm externalMedia={media ?? []} onChange={m => setMedia(m)} />
			</View>
		</Dialog>
	);
}

const styles = StyleSheet.create(theme => ({
	actionButtonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.spacing(2),
		justifyContent: "flex-end",
	},
	actionButtonsCreate: {
		flexDirection: "row",
		marginTop: theme.spacing(1),
		gap: theme.spacing(2),
		alignContent: "center",
	},
	ButtonAction: {
		flex: 1,
		alignItems: "center",
	},
	cardContainer: {
		// flex: 1,
		gap: theme.spacing(3),
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
	},
	actionsContainer: {
		flexDirection: "row",
		flexWrap: "wrap-reverse",
		justifyContent: "space-between",
	},
	deleteButtonColor: {
		color: theme.colors.error.main,
	},
	disabledText: {
		color: theme.colors.disabled.text,
	},
	iconColorSubmit: {
		color: theme.colors.primary.text,
	},
	iconColorCancel: {
		color: theme.colors.secondary.main,
	},
}));
