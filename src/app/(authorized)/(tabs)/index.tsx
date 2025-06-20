import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Loading, ModalContainer, Typography } from "@/ui";
import { useGetDailyAssignmentsAndReports } from "@/api/client";
import ReportForm from "@/ui/forms/common/ReportForm";
import { formatToDate, getFormatedDate } from "@/core/utils/dateUtils";
import { useTranslation } from "react-i18next";
import Calendar from "@/components/user/calendar/Calendar";
import { useLanguage } from "@/core/context/LanguageContext";
import { useCurrentUser } from "@/core/auth";
import NoAssignments from "@/components/Assignment/RenderNoAssignments";
import useAssignmentStatusHandler from "@/core/hooks/home/useAssignmentStatusHandler";
import DailyAssignmentsListRender from "@/components/Assignment/DailyAssignmentsListRender";

export default function DailyAssignmentsList() {
	const user = useCurrentUser();
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	const {
		data: dailyAssignmentsAndReports,
		isLoading: dailyAssignmentsAndReportsIsLoading,
		refetch: dailyAssignmentsAndReportsRefetch,
	} = useGetDailyAssignmentsAndReports();

	const {
		handleStatusChange,
		handleReportSubmit, // Добавлена новая функция
		showReport,
		totalTime,
		assignmentAndReport,
		setShowReport,
	} = useAssignmentStatusHandler({
		dailyAssignmentsAndReportsRefetch,
		userId: user?.id,
	});

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	if (dailyAssignmentsAndReportsIsLoading) {
		return <Loading />;
	}

	const getFilteredAssignments = () => {
		if (!dailyAssignmentsAndReports) return [];

		const date = getFormatedDate(selectedDate);
		return dailyAssignmentsAndReports.filter(ar => formatToDate(ar.assignment.date) === date);
	};

	const filteredAssignments = getFilteredAssignments();
	const assignmentDates = dailyAssignmentsAndReports
		? dailyAssignmentsAndReports.map(ar => ar.assignment.date)
		: [];

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.page}>
				<View style={styles.sidebar}>
					<Calendar
						onConfirm={(date: Date) => setSelectedDate(date)}
						assignedDates={assignmentDates}
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
					{filteredAssignments.length === 0 ? (
						<NoAssignments selectedDate={selectedDate} />
					) : (
						<View style={styles.scrollContainer}>
							<DailyAssignmentsListRender
								assignments={filteredAssignments}
								onStatusChange={handleStatusChange}
							/>
						</View>
					)}
				</View>
			</View>

			{showReport && (
				<ModalContainer visible={showReport} onClose={() => setShowReport(false)}>
					<ReportForm
						onCancel={() => setShowReport(false)}
						onSubmit={handleReportSubmit}
						assignmentAndReport={assignmentAndReport}
						totalTime={totalTime}
					/>
				</ModalContainer>
			)}
		</ScrollView>
	);
}

// Стили остаются без изменений

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
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
	emptyStateContainer: {
		flex: 1,
		textAlign: "center",
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
		flex: { sm: 1, md: 0.5 },

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
