// DailyAssignmentForms.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import {
	AdminReadUser,
	DailyAssignmentCreate,
	DailyAssignmentResponse,
	DailyAssignmentUpdate,
	DeleteDailyAssignmentParams,
	EditDailyAssignmentParams,
} from "@/api/admin";
import CustomPicker from "@/ui/Picker";

interface Location {
	id: number;
	name: string;
}

interface CreateDailyAssignmentFormProps {
	onSubmit: (assignmentData: DailyAssignmentCreate) => void;
	onClose: () => void;
	isLoading?: boolean;
	users: AdminReadUser[];
	locations: Location[];
}

export function CreateDailyAssignmentForm({
	onSubmit,
	onClose,
	isLoading,
	users,
	locations,
}: CreateDailyAssignmentFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<DailyAssignmentCreate>({
		location_id: locations.length > 0 ? locations[0].id : 0,
		user_id: users.length > 0 ? users[0].id : 0,
		date: new Date().toISOString().split("T")[0],
		admin_note: "",
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	const getUserDisplayName = (user: AdminReadUser) => {
		return user.full_name || user.nickname || `User ${user.id}`;
	};

	// Convert users to CustomPicker options format
	const userOptions = users.map(user => ({
		label: getUserDisplayName(user),
		value: user.id.toString(),
	}));

	// Convert locations to CustomPicker options format
	const locationOptions = locations.map(location => ({
		label: location.name,
		value: location.id.toString(),
	}));

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.createDailyAssignment")}
			</Typography>
			<View style={styles.zIndex10}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.user") + "*"}
					value={formData.user_id?.toString() || ""}
					options={userOptions}
					onChange={value => setFormData({ ...formData, user_id: parseInt(value) })}
					style={styles.input}
				/>
			</View>

			<View style={styles.zIndex1}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.location") + "*"}
					value={formData.location_id?.toString() || ""}
					options={locationOptions}
					onChange={value => setFormData({ ...formData, location_id: parseInt(value) })}
					style={styles.input}
				/>
			</View>

			<View style={styles.dateContainer}>
				<Typography variant="body2" style={styles.label}>
					{t("components.dailyAssignmentsList.date") + "*"}
				</Typography>
				<Input
					value={formData.date || ""}
					onChangeText={text => setFormData({ ...formData, date: text })}
					style={styles.input}
					placeholder="YYYY-MM-DD"
				/>
			</View>

			<Input
				label={t("components.dailyAssignmentsList.adminNote")}
				value={formData.admin_note || ""}
				onChangeText={text => setFormData({ ...formData, admin_note: text })}
				style={styles.input}
				multiline
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("admin.createDailyAssignment")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.close")}
				</Button>
			</View>
		</Card>
	);
}

interface EditDailyAssignmentFormProps {
	assignment: DailyAssignmentResponse;
	onSubmit: (
		assignmentId: EditDailyAssignmentParams,
		assignmentData: DailyAssignmentUpdate
	) => void;
	onClose: () => void;
	isLoading?: boolean;
	users: AdminReadUser[];
	locations: Location[];
}

export function EditDailyAssignmentForm({
	assignment,
	onSubmit,
	onClose,
	isLoading,
	users,
	locations,
}: EditDailyAssignmentFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<DailyAssignmentUpdate>({
		location_id: assignment.location_id,
		user_id: assignment.user_id,
		date: assignment.date,
		admin_note: assignment.admin_note || undefined,
	});

	const handleSubmit = () => {
		onSubmit({ daily_assignment_id: assignment.id }, formData);
	};

	const getUserDisplayName = (user: AdminReadUser) => {
		return user.full_name || user.nickname || `User ${user.id}`;
	};

	// Convert users to CustomPicker options format
	const userOptions = users.map(user => ({
		label: getUserDisplayName(user),
		value: user.id.toString(),
	}));

	// Convert locations to CustomPicker options format
	const locationOptions = locations.map(location => ({
		label: location.name,
		value: location.id.toString(),
	}));

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.editDailyAssignment")}
			</Typography>

			<View style={styles.zIndex10}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.user") + "*"}
					value={formData.user_id?.toString() || ""}
					options={userOptions}
					onChange={value => setFormData({ ...formData, user_id: parseInt(value) })}
					style={styles.input}
				/>
			</View>

			<View style={styles.zIndex1}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.location") + "*"}
					value={formData.location_id?.toString() || ""}
					options={locationOptions}
					onChange={value => setFormData({ ...formData, location_id: parseInt(value) })}
					style={styles.input}
				/>
			</View>

			<View style={styles.dateContainer}>
				<Typography variant="body2" style={styles.label}>
					{t("components.dailyAssignmentsList.date") + "*"}
				</Typography>
				<Input
					value={formData.date || ""}
					onChangeText={text => setFormData({ ...formData, date: text })}
					style={styles.input}
					placeholder="YYYY-MM-DD"
				/>
			</View>

			<Input
				label={t("components.dailyAssignmentsList.adminNote")}
				value={formData.admin_note || ""}
				onChangeText={text => setFormData({ ...formData, admin_note: text })}
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

interface DeleteDailyAssignmentConfirmProps {
	assignment: DailyAssignmentResponse;
	onConfirm: (assignmentId: DeleteDailyAssignmentParams) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function DeleteDailyAssignmentConfirm({
	assignment,
	onConfirm,
	onClose,
	isLoading,
}: DeleteDailyAssignmentConfirmProps) {
	const { t } = useTranslation();

	return (
		<Card size="medium" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.deleteDailyAssignment")}
			</Typography>

			<Typography variant="body1">
				{t("admin.deleteDailyAssignmentConfirmation", {
					id: assignment.id,
					date: assignment.date,
				})}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onConfirm({ daily_assignment_id: assignment.id })}
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
	pickerContainer: {
		marginBottom: theme.spacing(1.5),
	},
	dateContainer: {
		marginBottom: theme.spacing(1.5),
	},
	picker: {
		backgroundColor: theme.colors.background.main,
		marginTop: theme.spacing(0.5),
	},
	label: {
		color: theme.colors.text.secondary,
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
	zIndex10: {
		zIndex: 10,
	},
	zIndex1: {
		zIndex: 1,
	},
}));
