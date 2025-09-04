import { Button, Dialog, Picker, Typography } from "@/ui";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import RangeDatesInput from "@/ui/date/RangeDatesInput";
import { ReportExportParams, useCreateExportReports, useGetUsers } from "@/api/admin";
import { getTimeZone } from "@/core/utils/dateUtils";
import { useLanguage } from "@/core/context/LanguageContext";
import dayjs from "dayjs";
import { PickerOption } from "@/ui/common/Picker";

interface ExportReportsPanelProps {
	isVisible: boolean;
	onClose: () => void;
}

export const DATE_FORMAT = "YYYY-MM-DD";

export default function ExportReportsDialog({ isVisible, onClose }: ExportReportsPanelProps) {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const mutation = useCreateExportReports();
	// const [showCsv, setShowCsv] = useState<boolean>(false);
	// const [showExcel, setShowExcel] = useState<boolean>(true);
	const today = dayjs(Date.now()).format(DATE_FORMAT);

	const [userId, setUserId] = useState<number | null>(null);
	const { data: users } = useGetUsers();

	const timeZone = getTimeZone();
	const [formData, setFormData] = useState<ReportExportParams>({
		export_type: "excel",
		start_date: today,
		end_date: today,
		timezone: timeZone ?? "Europe/Berlin",
		lang: currentLanguage,
		user_id: null,
	});

	const handleSubmit = async () => {
		if (!formData.start_date || !formData.end_date || !formData.export_type) {
			console.error(
				"Error with parametrs start_date : " +
					formData.start_date +
					" end_date: " +
					formData.end_date
			);
			return;
		}
		try {
			if (formData.user_id === 0) {
				await mutation.mutateAsync({ data: { ...formData, user_id: null } });
			} else {
				await mutation.mutateAsync({ data: formData });
			}
			alert("success");
			onClose();
		} catch (e) {
			console.error(e);
			alert(t("reports.export_failed"));
		}
	};

	const getUsers = (): PickerOption[] => {
		if (!users) return [];

		const mappedUsers = users?.map(user => ({
			label: user.full_name ?? "unknown",
			value: user.id.toString(),
		}));

		return [{ label: "All users", value: "0" }, ...mappedUsers];
	};

	// const selectFormat = (format: "csv" | "excel") => {
	// 	setShowCsv(format === "csv");
	// 	setShowExcel(format === "excel");
	// 	setFormData(prev => ({ ...prev, export_type: format }));
	// };

	return (
		<Dialog
			visible={isVisible}
			onClose={onClose}
			card
			maxWidth={"md"}
			fullWidth
			cardProps={{ size: "large", variant: "standard" }}
			scrollView
			header={
				<View style={styles.headerContainer}>
					<View style={styles.headerWithIconContainer}>
						<View style={styles.iconContainer}>
							<FontAwesome5
								name={"file-alt"}
								size={20}
								color={styles.fileAltIconColor.color}
							/>
						</View>
						<Typography variant={"h5"}>{t("reports.generation")}</Typography>
					</View>
				</View>
			}
			actions={
				<View style={styles.actionButtons}>
					<Button
						style={styles.ButtonAction}
						variant="outlined"
						color="secondary"
						size="medium"
						onPress={onClose}
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
						onPress={handleSubmit}
					>
						<FontAwesome5 name="check" size={16} color={styles.iconColorSubmit.color} />
						{"  "}
						{t("reports.submit")}
					</Button>
				</View>
			}
		>
			<View style={styles.contentContainer}>
				<Picker
					value={userId ? userId.toString() : "0"}
					placeholder={"All users"}
					onChange={value => {
						const parsed =
							value !== undefined && value !== null ? parseInt(value) : null;
						setUserId(parsed);
						setFormData(prev => ({
							...prev,
							user_id: parsed,
						}));
						console.log("value: " + value);
					}}
					options={getUsers()}
				/>

				<RangeDatesInput
					startValue={formData.start_date}
					endValue={formData.end_date}
					onChange={(startDate, endDate) => {
						setFormData(prev => ({
							...prev,
							start_date: startDate,
							end_date: endDate,
						}));

						console.log("startDate: " + startDate + " EndDate " + endDate);
					}}
				/>
				{formData.start_date && formData.end_date && (
					<View style={styles.periodContainer}>
						<Typography>
							{t("reports.selectedPeriod")}: {formData.start_date} -{" "}
							{formData.end_date}
						</Typography>
					</View>
				)}
				{/*<View style={styles.checkBoxContainer}>*/}
				{/*	<Typography>{t("reports.chooseFormat")}:</Typography>*/}
				{/*	<Checkbox*/}
				{/*		size={"large"}*/}
				{/*		label={"Excel (.xlsx)"}*/}
				{/*		checked={showExcel}*/}
				{/*		onChange={() => selectFormat("excel")}*/}
				{/*	/>*/}
				{/*	<Checkbox*/}
				{/*		size={"large"}*/}
				{/*		label={"CSV (.csv)"}*/}
				{/*		checked={showCsv}*/}
				{/*		onChange={() => selectFormat("csv")}*/}
				{/*	/>*/}
				{/*</View>*/}
			</View>
		</Dialog>
	);
}

const styles = StyleSheet.create(theme => ({
	cardContainer: {
		flex: 1,
		padding: theme.spacing(4),
	},
	headerContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: theme.spacing(2),
	},
	headerWithIconContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	checkBoxContainer: {
		flex: 1,
		flexDirection: "row",
		gap: theme.spacing(4),
	},
	periodContainer: {
		flex: 1,

		alignItems: "center",
		backgroundColor: theme.colors.primary.mainOpacity,
		padding: theme.spacing(2),
		borderRadius: theme.borderRadius(3),
	},
	daysButtonsContainer: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	fileAltIconColor: {
		color: theme.colors.primary.main,
	},
	contentContainer: {
		flex: 1,
		flexDirection: "column",
		gap: theme.spacing(4),
		marginBottom: theme.spacing(2),
	},
	pickerContainer: {
		flex: 1,
		zIndex: 100,
	},
	buttonExit: {
		alignSelf: "flex-end",
	},

	cancelButton: {
		marginTop: theme.spacing(1),
		alignSelf: "flex-end",
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.primary.mainOpacity,
		justifyContent: "center",
		alignItems: "center",
	},
	iconColorSubmit: {
		color: theme.colors.primary.text,
	},
	iconColorCancel: {
		color: theme.colors.secondary.main,
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
}));
