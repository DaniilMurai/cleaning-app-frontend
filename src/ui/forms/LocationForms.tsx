// src/components/forms/LocationForms.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Input, ModalContainer } from "@/ui";
import Typography from "@/ui/Typography";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { DeleteLocationParams, EditLocationParams, LocationCreate } from "@/api/admin";

interface CreateLocationFormProps {
	isVisible: boolean;
	onClose: () => void;
	onSubmit: (data: LocationCreate) => Promise<void>;
	isLoading: boolean;
}

export const CreateLocationForm: React.FC<CreateLocationFormProps> = ({
	isVisible,
	onClose,
	onSubmit,
	isLoading,
}) => {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError(t("admin.locationNameRequired"));
			return;
		}

		try {
			await onSubmit({ name });
			handleClose();
		} catch (err) {
			setError(t("common.errorOccurred"));
		}
	};

	const handleClose = () => {
		setName("");
		setError("");
		onClose();
	};

	return (
		<ModalContainer visible={isVisible} onClose={handleClose}>
			<View style={styles.formContainer}>
				<Typography variant={"h5"}>{t("admin.createLocation")}</Typography>
				<Input
					label={t("admin.locationName")}
					value={name}
					onChangeText={setName}
					placeholder={t("admin.enterLocationName")}
					error={error}
				/>

				<View style={styles.buttonContainer}>
					<Button variant="outlined" onPress={handleClose} style={styles.button}>
						{t("common.cancel")}
					</Button>
					<Button
						variant="contained"
						onPress={handleSubmit}
						loading={isLoading}
						style={styles.button}
					>
						{t("common.create")}
					</Button>
				</View>
			</View>
		</ModalContainer>
	);
};

interface EditLocationFormProps {
	isVisible: boolean;
	onClose: () => void;
	onSubmit: (locationId: EditLocationParams, data: LocationCreate) => Promise<void>;
	isLoading: boolean;
	location?: { id: DeleteLocationParams; name: string };
}

export const EditLocationForm: React.FC<EditLocationFormProps> = ({
	isVisible,
	onClose,
	onSubmit,
	isLoading,
	location,
}) => {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	React.useEffect(() => {
		if (location) {
			setName(location.name);
		}
	}, [location]);

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError(t("admin.locationNameRequired"));
			return;
		}

		if (!location) {
			return;
		}

		try {
			await onSubmit(location.id, { name });
			handleClose();
		} catch (err) {
			setError(t("common.errorOccurred"));
		}
	};

	const handleClose = () => {
		setError("");
		onClose();
	};

	return (
		<ModalContainer visible={isVisible} onClose={handleClose}>
			<View style={styles.formContainer}>
				<Typography variant={"h5"}>{t("admin.editLocation")}</Typography>
				<Input
					label={t("admin.locationName")}
					value={name}
					onChangeText={setName}
					placeholder={t("admin.enterLocationName")}
					error={error}
				/>

				<View style={styles.buttonContainer}>
					<Button variant="outlined" onPress={handleClose} style={styles.button}>
						{t("common.cancel")}
					</Button>
					<Button
						variant="contained"
						onPress={handleSubmit}
						loading={isLoading}
						style={styles.button}
					>
						{t("common.save")}
					</Button>
				</View>
			</View>
		</ModalContainer>
	);
};

interface DeleteLocationConfirmProps {
	isVisible: boolean;
	onClose: () => void;
	onConfirm: (locationId: DeleteLocationParams) => Promise<void>;
	isLoading: boolean;
	location?: { id: DeleteLocationParams; name: string };
}

export const DeleteLocationConfirm: React.FC<DeleteLocationConfirmProps> = ({
	isVisible,
	onClose,
	onConfirm,
	isLoading,
	location,
}) => {
	const { t } = useTranslation();

	const handleConfirm = async () => {
		if (!location) return;

		try {
			await onConfirm(location.id);
			onClose();
		} catch (err) {
			// Handle error
		}
	};

	return (
		<ModalContainer visible={isVisible} onClose={onClose}>
			<View style={styles.formContainer}>
				<Typography variant={"h5"}>{t("admin.deleteLocation")}</Typography>
				<Typography>
					{t("admin.deleteLocationConfirm", { name: location?.name })}
				</Typography>

				<View style={styles.buttonContainer}>
					<Button variant="outlined" onPress={onClose} style={styles.button}>
						{t("common.cancel")}
					</Button>
					<Button
						variant="contained"
						onPress={handleConfirm}
						loading={isLoading}
						style={[styles.button, styles.deleteButton]}
					>
						{t("common.delete")}
					</Button>
				</View>
			</View>
		</ModalContainer>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		gap: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
		marginTop: 16,
	},
	button: {
		minWidth: 100,
	},
	deleteButton: {
		backgroundColor: "red",
	},
});
