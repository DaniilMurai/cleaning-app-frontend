import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Typography } from "@/ui";
import { useGetDailyAssignmentsAndReports, useGetDailyAssignmentsDates } from "@/api/client";
import ReportForm from "@/ui/forms/common/ReportForm";
import { useTranslation } from "react-i18next";
import Calendar from "@/components/user/calendar/Calendar";
import { useLanguage } from "@/core/context/LanguageContext";
import { useCurrentUser } from "@/core/auth";
import NoAssignments from "@/components/Assignment/RenderNoAssignments";
import useAssignmentStatusHandler from "@/core/hooks/home/useAssignmentStatusHandler";
import DailyAssignmentsListRender from "@/components/Assignment/DailyAssignmentsListRender";
import dayjs from "dayjs";
import { keepPreviousData } from "@tanstack/query-core";

export default function DailyAssignmentsList() {
	const user = useCurrentUser();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const { data: dailyAssignmentsAndReports, refetch: dailyAssignmentsAndReportsRefetch } =
		useGetDailyAssignmentsAndReports(
			{
				start_date: null,
				end_date: null,
				dates: [dayjs(selectedDate).format("YYYY-MM-DD")],
			},
			{
				query: {
					enabled: !!selectedDate,
					placeholderData: keepPreviousData,
					refetchOnMount: false,
				},
			}
		);

	const { data: assignmentDates } = useGetDailyAssignmentsDates();

	const {
		handleStatusChange,
		handleReportSubmit,
		showReport,
		totalTime,
		assignment,
		setShowReport,
	} = useAssignmentStatusHandler({
		dailyAssignmentsAndReportsRefetch,
		userId: user?.id,
	});

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.page}>
				<View style={styles.sidebar}>
					<Calendar
						onConfirm={(date: Date) => setSelectedDate(date)}
						assignedDates={assignmentDates ?? []}
					/>
				</View>
				<View style={styles.tasksContainer}>
					<View style={styles.dateTaskContainer}>
						<Typography variant={"h5"}>{t("admin.tasks")}</Typography>
						<Typography variant={"body1"} color={styles.dateText.color}>
							{selectedDate
								.toLocaleDateString(currentLanguage, {
									weekday: "long",
									day: "numeric",
									month: "long",
								})
								.replace(/^./, str => str.toUpperCase())}
						</Typography>
					</View>
					{dailyAssignmentsAndReports?.length === 0 ? (
						<NoAssignments selectedDate={selectedDate} />
					) : (
						<View style={styles.scrollContainer}>
							<DailyAssignmentsListRender
								assignments={dailyAssignmentsAndReports ?? []}
								onStatusChange={handleStatusChange}
							/>
						</View>
					)}
				</View>
			</View>

			{showReport && (
				<ReportForm
					isVisible={showReport}
					onCancel={() => setShowReport(false)}
					onSubmit={handleReportSubmit}
					assignment={assignment}
					totalTime={totalTime}
				/>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	contentContainerStyle: {
		// flex: 1,
		flexGrow: 1,
		gap: theme.spacing(3),
	},
	contentContainer: {
		paddingVertical: theme.spacing(2),
		paddingHorizontal: theme.spacing(2),
	},
	tasksContainer: {
		flex: 1,
		gap: theme.spacing(2),
		marginHorizontal: { xs: 0, md: theme.spacing(3) },
	},
	scrollContainer: {
		flex: 1,
	},

	page: {
		flex: 1,
		flexDirection: {
			xs: "column",
			sm: "column",
			md: "row",
		},
		gap: { xs: theme.spacing(3), sm: theme.spacing(0), md: theme.spacing(6) },
	},
	sidebar: {
		flex: { sm: 0.5, md: 0.5 },

		alignSelf: "flex-start",
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	mainContent: { flex: 1, padding: theme.spacing(2) },
	dateText: {
		color: theme.colors.text.disabled,
	},
	dateTaskContainer: {},
	iconColor: {
		color: theme.colors.primary.main,
	},
	backgroundIcon: {
		color: theme.colors.primary.mainOpacity,
	},
	iconContainer: {
		backgroundColor: theme.colors.primary.mainOpacity,
		borderRadius: theme.borderRadius(999),
		padding: theme.spacing(2),
	},
	noAssignmentCard: {
		paddingVertical: {
			xs: theme.spacing(3),
			md: theme.spacing(8),
		},
		paddingHorizontal: theme.spacing(3),
		width: "100%",
	},
}));
