import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

// Types based on the provided schemas
export interface RoomCreate {
	name: string;
	location_id: number;
}

export interface RoomResponse {
	id: number;
	name: string;
	location_id: number;
}

export interface EditRoomParams {
	room_id: number;
}

export interface DeleteRoomParams {
	room_id: number;
}

export interface RoomUpdate {
	name?: string;
	location_id?: number;
}

interface CreateRoomFormProps {
	onSubmit: (roomData: RoomCreate) => void;
	onClose: () => void;
	isLoading?: boolean;
	location_id: number;
}

export function CreateRoomForm({ onSubmit, onClose, isLoading, location_id }: CreateRoomFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<RoomCreate>({
		name: "",
		location_id: location_id,
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.createRoom")}
			</Typography>

			<Input
				label={t("components.roomsList.name") + "*"}
				value={formData.name}
				onChangeText={text => setFormData({ ...formData, name: text })}
				style={styles.input}
			/>

			{/* Location dropdown/selector could be implemented here */}
			{/* This is a simplified version - you might want to add a proper dropdown */}

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("admin.createRoom")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.close")}
				</Button>
			</View>
		</Card>
	);
}

interface EditRoomFormProps {
	room: RoomResponse;
	onSubmit: (roomId: EditRoomParams, roomData: RoomUpdate) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function EditRoomForm({ room, onSubmit, onClose, isLoading }: EditRoomFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<RoomUpdate>({
		name: room.name,
		location_id: room.location_id,
	});

	const handleSubmit = () => {
		onSubmit({ room_id: room.id }, formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.editRoom")}
			</Typography>

			<Input
				label={t("components.roomsList.name") + "*"}
				value={formData.name}
				onChangeText={text => setFormData({ ...formData, name: text })}
				style={styles.input}
			/>

			{/* Location dropdown/selector could be implemented here */}

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("common.save")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.cancel")}
				</Button>
			</View>
		</Card>
	);
}

interface DeleteRoomConfirmProps {
	room: RoomResponse;
	onConfirm: (roomId: DeleteRoomParams) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function DeleteRoomConfirm({ room, onConfirm, onClose, isLoading }: DeleteRoomConfirmProps) {
	const { t } = useTranslation();

	return (
		<Card size="medium" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.deleteRoom")}
			</Typography>

			<Typography variant="body1">
				{t("admin.deleteRoomConfirmation", { name: room.name })}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onConfirm({ room_id: room.id })}
					loading={isLoading}
				>
					{t("common.delete")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.cancel")}
				</Button>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(3),
		width: "100%",
		maxWidth: 600,
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	input: {
		marginBottom: theme.spacing(0.5),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: theme.spacing(3),
		gap: theme.spacing(2),
	},
	buttonError: {
		backgroundColor: theme.colors.error.main,
	},
}));
