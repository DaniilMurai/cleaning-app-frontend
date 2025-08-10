// src/ui/components/DailyAssignmentForms.tsx

import { View } from "react-native";
import { Button, Dialog } from "@/ui";
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
	DeleteDailyAssignmentsGroupParams,
	EditDailyAssignmentParams,
	useCheckAssignmentGroup,
	useGetLocations,
	useGetUsers,
} from "@/api/admin";
import CustomPicker from "@/ui/common/Picker";
import dayjs, { Dayjs } from "dayjs";
import DateInput from "@/ui/date/DateInput";
import { DatesInput } from "@/ui/date/DatesInput";
import Checkbox from "@/ui/common/CheckBox";
import { v4 as uuidv4 } from "uuid";

interface CreateDailyAssignmentFormProps {
	onSubmit: (assignmentData: DailyAssignmentCreate[]) => void;
	onClose: () => void;
	isVisible: boolean;
	isLoading?: boolean;
}

export function CreateDailyAssignmentForm({
	onSubmit,
	onClose,
	isLoading,
	isVisible,
}: CreateDailyAssignmentFormProps) {
	const { t } = useTranslation();

	const { data: users } = useGetUsers();
	const { data: locations } = useGetLocations();

	const getUserDisplayName = (user: AdminReadUser) => {
		return user.full_name || user.nickname || `User ${user.id}`;
	};

	const userOptions =
		users &&
		users.map(user => ({
			label: getUserDisplayName(user),
			value: user.id.toString(),
		}));

	const locationOptions =
		locations &&
		locations.map(loc => ({
			label: loc.name,
			value: loc.id.toString(),
		}));

	const [formData, setFormData] = useState<DailyAssignmentCreate>({
		location_id: locations && locations.length > 0 ? locations[0].id : 0,
		user_id: users && users.length > 0 ? users[0].id : 0,
		date: dayjs().format("YYYY-MM-DD HH:mm"),
		admin_note: "",
		group_uuid: uuidv4(),
	});

	console.log("formData: ", formData);

	const [mode, setMode] = useState<"normal" | "everyWeek" | "everyTwoWeeks" | "everyMonth">(
		"everyWeek"
	);

	const [dates, setDates] = useState<Dayjs[]>([]);

	console.log("dates in DailyAssignmentForms: ", dates);

	// Изменяем обработчик сабмита
	const handleSubmit = () => {
		if (dates.length === 0) return;

		const updatedData: DailyAssignmentCreate[] = dates.map(date => ({
			...formData,
			date: dayjs(date).format("YYYY-MM-DD HH:mm"),
		}));

		onSubmit(updatedData);
	};

	return (
		<Dialog
			onClose={onClose}
			card
			visible={isVisible}
			cardProps={{
				size: "large",
				variant: "contained",
			}}
			scrollView
			header={
				<Typography variant="h5" style={styles.title}>
					{t("admin.createDailyAssignment")}
				</Typography>
			}
			actions={
				<View style={styles.buttonsContainer}>
					<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
						{t("admin.createDailyAssignment")}
					</Button>
					<Button variant="outlined" onPress={onClose}>
						{t("common.close")}
					</Button>
				</View>
			}
		>
			<View style={styles.zIndex10}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.user") + "*"}
					value={formData.user_id?.toString() || ""}
					options={userOptions ?? []}
					onChange={value =>
						value &&
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
					options={locationOptions ?? []}
					onChange={value =>
						value &&
						setFormData(prev => ({
							...prev,
							location_id: parseInt(value, 10),
						}))
					}
					style={styles.input}
				/>
			</View>

			<DatesInput
				label={t("components.dailyAssignmentsList.date") + "*"}
				values={dates.map(date => date.format("YYYY-MM-DD HH:mm"))}
				onChange={newDates => setDates(newDates.map(v => dayjs(v)))}
				style={styles.dateContainer}
				multipleEnterMode={mode}
				limitYear={1}
			/>
			<View style={styles.modesContainer}>
				<Checkbox
					label={"Normal Mode"}
					checked={mode === "normal"}
					onChange={() => setMode("normal")}
				/>
				<Checkbox
					label={"Every Week"}
					checked={mode === "everyWeek"}
					onChange={() => setMode("everyWeek")}
				/>
				<Checkbox
					label={"Every Two Weeks"}
					checked={mode === "everyTwoWeeks"}
					onChange={() => setMode("everyTwoWeeks")}
				/>
				<Checkbox
					label={"Every Month"}
					checked={mode === "everyMonth"}
					onChange={() => setMode("everyMonth")}
				/>
			</View>
			<Input
				label={t("components.dailyAssignmentsList.adminNote")}
				value={formData.admin_note || ""}
				onChangeText={text => setFormData(prev => ({ ...prev, admin_note: text }))}
				style={styles.input}
				multiline
			/>
		</Dialog>
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
	isVisible: boolean;
	isLoading?: boolean;
}

export function EditDailyAssignmentForm({
	assignment,
	onSubmit,
	onClose,
	isVisible,
	isLoading,
}: EditDailyAssignmentFormProps) {
	const { t } = useTranslation();

	const { data: users } = useGetUsers();
	const { data: locations } = useGetLocations();

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

	const userOptions =
		users &&
		users.map(user => ({
			label: getUserDisplayName(user),
			value: user.id.toString(),
		}));
	const locationOptions =
		locations &&
		locations.map(loc => ({
			label: loc.name,
			value: loc.id.toString(),
		}));

	return (
		<Dialog
			visible={isVisible}
			onClose={onClose}
			card
			cardProps={{
				size: "large",
				variant: "contained",
			}}
			scrollView
			header={
				<Typography variant="h5" style={styles.title}>
					{t("admin.editDailyAssignment")}
				</Typography>
			}
			actions={
				<View style={styles.buttonsContainer}>
					<Button variant="contained" onPress={handleSubmitEdit} loading={isLoading}>
						{t("common.save")}
					</Button>
					<Button variant="outlined" onPress={onClose}>
						{t("common.cancel")}
					</Button>
				</View>
			}
		>
			<View style={styles.zIndex10}>
				<CustomPicker
					label={t("components.dailyAssignmentsList.user") + "*"}
					value={formData.user_id?.toString() || ""}
					options={userOptions ?? []}
					onChange={value =>
						value &&
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
					options={locationOptions ?? []}
					onChange={value =>
						value &&
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
		</Dialog>
	);
}

interface DeleteGroupDailyAssignmentsConfirmProps {
	assignment: DailyAssignmentResponse;
	onGroupConfirm: (assignmentId: DeleteDailyAssignmentsGroupParams) => void;
	onSingleConfirm: (assignmentId: DeleteDailyAssignmentParams) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function DeleteGroupDailyAssignmentsConfirm({
	assignment,
	onGroupConfirm,
	onSingleConfirm,
	onClose,
	isLoading,
}: DeleteGroupDailyAssignmentsConfirmProps) {
	const { t } = useTranslation();
	const { data: groupData } = useCheckAssignmentGroup({ daily_assignment_id: assignment.id });
	const interval = groupData?.interval_days ?? 0;
	console.log("interval: ", interval);
	console.log("hello");
	return (
		<Card size="medium" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.deleteDailyAssignment")}
			</Typography>

			<Typography variant="body1">
				{t("components.assignmentGroup.futureAssignmentsInfo", {
					id: assignment.id,
					date: assignment.date,
					count: groupData?.assignments_amount ?? 0,
					interval:
						interval === 7
							? t("common.week")
							: interval === 14
								? t("common.twoWeeks")
								: interval >= 28
									? t("common.month")
									: interval > 0
										? t("common.days", { count: interval })
										: t("common.unknownInterval"),
				})}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onGroupConfirm({ daily_assignment_id: assignment.id })}
					loading={isLoading}
				>
					{t("components.assignmentGroup.deleteGroupButton")}
				</Button>

				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onSingleConfirm({ daily_assignment_id: assignment.id })}
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
		flexWrap: "wrap",
	},

	buttonError: {
		backgroundColor: theme.colors.error.main,
	},
	modesContainer: {
		flexDirection: "row",
		gap: theme.spacing(2),
		flexWrap: "wrap",
	},
}));
