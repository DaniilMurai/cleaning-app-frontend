import { Button, Dialog, Picker, Typography } from "@/ui";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { PickerOption } from "@/ui/common/Picker";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import RangeDatesInput from "@/ui/date/RangeDatesInput";
import { ReportExportParams, useCreateExportReports } from "@/api/admin";
import { getTimeZone } from "@/core/utils/dateUtils";
import { useLanguage } from "@/core/context/LanguageContext";
import dayjs from "dayjs";

interface ExportReportsPanelProps {
	isVisible: boolean;
	onClose: () => void;
}

export default function ExportReportsPanel({ isVisible, onClose }: ExportReportsPanelProps) {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const mutation = useCreateExportReports();

	const ExportType: PickerOption[] = [
		{ label: "csv", value: "csv" },
		{ label: "xlsx", value: "excel" },
	];
	const today = dayjs(Date.now()).format("YYYY-MM-DD");
	const timeZone = getTimeZone();
	console.log("timeZone: " + timeZone);
	const [formData, setFormData] = useState<ReportExportParams>({
		export_type: "csv",
		start_date: today,
		end_date: today,
		timezone: timeZone ?? "Europe/Berlin",
		lang: currentLanguage,
		// user_id: null,
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

		const response = await mutation.mutateAsync({
			data: formData,
		});
		console.log("response: " + response);
	};

	//
	// const handleSubmit = () => {
	// 	if (!dates || dates.length === 0) return;
	// 	const updatedData: DailyAssignmentCreate[] = dates.map(date => ({
	// 		...formData,
	// 		date: date.format("YYYY-MM-DD HH:mm"),
	// 	}));
	//
	// 	onSubmit(updatedData);
	// };

	return (
		<Dialog
			visible={isVisible}
			onClose={onClose}
			card
			cardProps={{ size: "large", variant: "standard" }}
			scrollView
			header={
				<View style={styles.headerContainer}>
					<View style={styles.headerWithIconContainer}>
						<FontAwesome5
							name={"file-alt"}
							size={20}
							color={styles.fileAltIconColor.color}
						/>
						<Typography variant={"h5"}>Управление отчетами</Typography>
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
				<View style={styles.pickerContainer}>
					<Picker
						onChange={data => {
							setFormData(prev => ({
								...prev,
								export_type: data,
							}));
							console.log("change 3");
						}}
						label={"format"}
						options={ExportType}
						value={formData.export_type}
					/>
				</View>
				<Typography variant={"h6"}>Выбери range</Typography>
				<RangeDatesInput
					startValue={today}
					endValue={today}
					onChange={(startDate, endDate) => {
						setFormData(prev => ({
							...prev,
							start_date: startDate,
							end_date: endDate,
						}));
						console.log("startDate: " + startDate + " EndDate " + endDate);
					}}
				/>
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
