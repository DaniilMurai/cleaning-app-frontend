// src/ui/components/DailyAssignmentForms.tsx

import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/common/Input";
import React, { useState } from "react";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";
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
import CustomPicker from "@/ui/common/Picker";
import dayjs from "dayjs";
import DateInput from "@/ui/components/date/DateInput";

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

	// Локально храним дату как ISO-строку (YYYY-MM-DD)
	const [formData, setFormData] = useState<DailyAssignmentCreate>({
		location_id: locations.length > 0 ? locations[0].id : 0,
		user_id: users.length > 0 ? users[0].id : 0,
		date: dayjs().format("YYYY-MM-DD HH:mm"),
		admin_note: "",
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	const getUserDisplayName = (user: AdminReadUser) => {
		return user.full_name || user.nickname || `User ${user.id}`;
	};

	const userOptions = users.map(user => ({
		label: getUserDisplayName(user),
		value: user.id.toString(),
	}));

	const locationOptions = locations.map(loc => ({
		label: loc.name,
		value: loc.id.toString(),
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
					onChange={value =>
						setFormData(prev => ({
							...prev,
							user_id: parseInt(value, 10),
						}))
					}
					style={styles.input}
				/>
			</View>

			<View style={styles.zIndex1}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.location") + "*"}
					value={formData.location_id?.toString() || ""}
					options={locationOptions}
					onChange={value =>
						setFormData(prev => ({
							...prev,
							location_id: parseInt(value, 10),
						}))
					}
					style={styles.input}
				/>
			</View>

			<DateInput
				label={t("components.dailyAssignmentsList.date") + "*"}
				value={formData.date}
				onChange={newDate => setFormData(prev => ({ ...prev, date: newDate }))}
				style={styles.dateContainer}
			/>

			<Input
				label={t("components.dailyAssignmentsList.adminNote")}
				value={formData.admin_note || ""}
				onChangeText={text => setFormData(prev => ({ ...prev, admin_note: text }))}
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

/* ─── Аналогично можно сделать для EditDailyAssignmentForm ───────── */

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
		admin_note: assignment.admin_note || "",
	});

	const handleSubmitEdit = () => {
		onSubmit({ daily_assignment_id: assignment.id }, formData);
	};

	const getUserDisplayName = (user: AdminReadUser) => {
		return user.full_name || user.nickname || `User ${user.id}`;
	};

	const userOptions = users.map(user => ({
		label: getUserDisplayName(user),
		value: user.id.toString(),
	}));
	const locationOptions = locations.map(loc => ({
		label: loc.name,
		value: loc.id.toString(),
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
					onChange={value =>
						setFormData(prev => ({
							...prev,
							user_id: parseInt(value, 10),
						}))
					}
					style={styles.input}
				/>
			</View>

			<View style={styles.zIndex1}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.location") + "*"}
					value={formData.location_id?.toString() || ""}
					options={locationOptions}
					onChange={value =>
						setFormData(prev => ({
							...prev,
							location_id: parseInt(value, 10),
						}))
					}
					style={styles.input}
				/>
			</View>

			<DateInput
				label={t("components.dailyAssignmentsList.date") + "*"}
				value={formData.date || ""}
				onChange={newDate => setFormData(prev => ({ ...prev, date: newDate }))}
				style={styles.dateContainer}
			/>

			<Input
				label={t("components.dailyAssignmentsList.adminNote")}
				value={formData.admin_note || ""}
				onChangeText={text => setFormData(prev => ({ ...prev, admin_note: text }))}
				style={styles.input}
				multiline
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmitEdit} loading={isLoading}>
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

/* ─── УНИФИЦИРОВАННЫЕ СТИЛИ ───────────────────────────────────────── */
const styles = StyleSheet.create(theme => ({
	pickerContainer: {
		backgroundColor: "#F5FCFF",
		borderRadius: 12,
		padding: 20,
		width: "90%",
		maxWidth: 400,
	},
	container: {
		padding: theme.spacing(3),
		width: "100%",
		maxWidth: 600,
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	input: {
		marginBottom: theme.spacing(1),
	},
	zIndex10: {
		zIndex: 10,
	},
	zIndex1: {
		zIndex: 1,
	},
	dateContainer: {
		marginBottom: theme.spacing(1.5),
	},
	label: {
		color: theme.colors.text.secondary,
		marginBottom: theme.spacing(0.5),
	},
	pickerWrapper: {
		borderRadius: 8,
		backgroundColor: "#F5FCFF",
		overflow: "hidden",
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
