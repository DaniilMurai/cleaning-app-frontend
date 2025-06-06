// LocationForms.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/common/Input";
import { useState } from "react";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { DeleteLocationParams, EditLocationParams, LocationUpdate } from "@/api/admin";

// Types based on the provided schemas
export interface LocationCreate {
	name: string;
	address?: string;
}

export interface LocationResponse {
	id: number;
	name: string;
	address: string;
}

interface CreateLocationFormProps {
	onSubmit: (locationData: LocationCreate) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function CreateLocationForm({ onSubmit, onClose, isLoading }: CreateLocationFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<LocationCreate>({
		name: "",
		address: "",
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.createLocation")}
			</Typography>

			<Input
				label={t("components.locationsList.name") + "*"}
				value={formData.name}
				onChangeText={text => setFormData({ ...formData, name: text })}
				style={styles.input}
			/>

			<Input
				label={t("components.locationsList.address")}
				value={formData.address}
				onChangeText={text => setFormData({ ...formData, address: text })}
				style={styles.input}
				multiline
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("admin.createLocation")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.close")}
				</Button>
			</View>
		</Card>
	);
}

interface EditLocationFormProps {
	location: LocationResponse;
	onSubmit: (locationId: EditLocationParams, locationData: LocationUpdate) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function EditLocationForm({
	location,
	onSubmit,
	onClose,
	isLoading,
}: EditLocationFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<LocationCreate>({
		name: location.name,
		address: location.address,
	});

	const handleSubmit = () => {
		onSubmit({ location_id: location.id }, formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.editLocation")}
			</Typography>

			<Input
				label={t("components.locationsList.name") + "*"}
				value={formData.name}
				onChangeText={text => setFormData({ ...formData, name: text })}
				style={styles.input}
			/>

			<Input
				label={t("components.locationsList.address")}
				value={formData.address}
				onChangeText={text => setFormData({ ...formData, address: text })}
				style={styles.input}
				multiline
			/>

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

interface DeleteLocationConfirmProps {
	location: LocationResponse;
	onConfirm: (locationId: DeleteLocationParams) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function DeleteLocationConfirm({
	location,
	onConfirm,
	onClose,
	isLoading,
}: DeleteLocationConfirmProps) {
	const { t } = useTranslation();

	return (
		<Card size="medium" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.deleteLocation")}
			</Typography>

			<Typography variant="body1">
				{t("admin.deleteLocationConfirmation", { name: location.name })}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onConfirm({ location_id: location.id })}
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
		maxWidth: 600,
		width: "100%",
		alignSelf: "center",
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
