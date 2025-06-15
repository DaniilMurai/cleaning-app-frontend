import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Card, Loading, ModalContainer, Typography } from "@/ui";
import {
	AssignmentStatus,
	CreateReport,
	UpdateReport,
	useCreateReport,
	useGetDailyAssignmentsAndReports,
	useUpdateDailyAssignmentStatus,
	useUpdateReport,
} from "@/api/client";
import useAuth from "@/core/context/AuthContext";
import ReportForm from "@/ui/forms/common/ReportForm";
import AssignmentCard from "@/ui/components/index/AssignmentCard";
import { formatToDate, getFormatedDate } from "@/core/utils/dateUtils";
import { useTranslation } from "react-i18next";
import Calendar from "@/ui/components/user/calendar/Calendar";
import { useLanguage } from "@/core/context/LanguageContext";
import { FontAwesome5 } from "@expo/vector-icons";

export default function DailyAssignmentsList() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const {
		data: dailyAssignmentsAndReports,
		isLoading: dailyAssignmentsAndReportsIsLoading,
		refetch: dailyAssignmentsAndReportsRefetch,
	} = useGetDailyAssignmentsAndReports();

	const { currentLanguage } = useLanguage();

	const statusOrder = {
		in_progress: 0,
		not_started: 1,
		partially_completed: 2,
		completed: 3,
	};

	const createReportMutation = useCreateReport();
	const updateReportMutation = useUpdateReport();
	const updateAssignmentMutation = useUpdateDailyAssignmentStatus();
	const [reportId, setReportId] = useState<number | null>(null);
	const [status, setStatus] = useState<AssignmentStatus>("not_started");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [showReport, setShowReport] = useState(false);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	if (dailyAssignmentsAndReportsIsLoading) {
		return <Loading />;
	}
	const handleStatusChange = async (
		assignmentId: number,
		newStatus: AssignmentStatus,
		totalTime: number,
		newStartTime: number | null,
		newEndTime: number | null,
		reportid: number | null
	) => {
		if (!user?.id) return;

		setStatus(newStatus);
		setStartTime(newStartTime);
		setEndTime(newEndTime);

		try {
			if (reportid === null) {
				console.log("newstartTime: ", newStartTime);
				const payload: CreateReport = {
					daily_assignment_id: assignmentId,
					user_id: user.id,
					status: newStatus,
					start_time: newStartTime?.toString() || null,
					end_time: newEndTime?.toString() || null,
				};
				const report = await createReportMutation.mutateAsync({ data: payload });
				await updateAssignmentMutation.mutateAsync({
					params: {
						assignment_id: assignmentId,
						status: status,
					},
				});
				await dailyAssignmentsAndReportsRefetch();
				setReportId(report.id);

				// await dailyAssignmentRefetch(); // хз надо или не посмотрю
			} else {
				console.log("else newstartTime: ", newStartTime);
				const payload: UpdateReport = {
					daily_assignment_id: assignmentId,
					user_id: user.id,
					status: newStatus,
					start_time: newStartTime?.toString(),
					end_time: newEndTime?.toString(),
				};
				console.log("payload start time " + payload.start_time);
				const updateReportResponse = await updateReportMutation.mutateAsync({
					data: payload,
					params: { report_id: reportid },
				});
				if (updateReportResponse)
					console.log(
						"updateReportResponse start_time" + updateReportResponse.start_time
					);
				await updateAssignmentMutation.mutateAsync({
					params: {
						assignment_id: assignmentId,
						status: newStatus,
					},
				});
			}
			await dailyAssignmentsAndReportsRefetch(); //хз надо или не посмотрю

			if (
				newStatus === AssignmentStatus.completed ||
				newStatus === AssignmentStatus.partially_completed
			) {
				setShowReport(true);
			}
		} catch (error) {
			console.error("Error updating report:", error);
		}
	};

	const handleReportSubmit = async (data: { text?: string; media?: string[] }) => {
		if (!user || !startTime || !endTime || !reportId || !dailyAssignmentsAndReports) return;

		if (startTime > endTime) return;
		2;
		try {
			await updateReportMutation.mutateAsync({
				params: { report_id: reportId },
				data: {
					daily_assignment_id: dailyAssignmentsAndReports[0].assignment.id, // Assuming single assignment for simplicity
					user_id: user.id,
					message: data?.text,
					media_links: data?.media,
					start_time: startTime.toString(),
					end_time: endTime.toString(),
					status,
				},
			});
			setShowReport(false);
			await dailyAssignmentsAndReportsRefetch();
		} catch (error) {
			console.error("Error submitting report:", error);
		}
	};

	const DailyAssignmentsListRender = (): React.JSX.Element[] => {
		if (!dailyAssignmentsAndReports) return [];

		const date = selectedDate ? getFormatedDate(selectedDate) : getFormatedDate(new Date());
		console.log("3 " + date);

		return dailyAssignmentsAndReports
			.filter(
				assignmentAndReport => formatToDate(assignmentAndReport.assignment.date) === date
			)
			.sort((a, b) => {
				const aStatus = a.assignment.status;
				const bStatus = b.assignment.status;
				return statusOrder[aStatus] - statusOrder[bStatus];
			})
			.map(assignmentAndReport => (
				<AssignmentCard
					key={assignmentAndReport.assignment.id}
					assignment={assignmentAndReport.assignment}
					onStatusChange={(newStatus, totalTime, newStartTime, newEndTime) =>
						handleStatusChange(
							assignmentAndReport.assignment.id,
							newStatus,
							totalTime,
							newStartTime,
							newEndTime,
							assignmentAndReport.report ? assignmentAndReport.report.id : null
						)
					}
					initialStatus={assignmentAndReport.assignment.status}
					alreadyDoneTime={
						(assignmentAndReport.report &&
							assignmentAndReport.report.duration_seconds) ??
						0
					}
					startTimeBackend={
						assignmentAndReport.report &&
						assignmentAndReport.report.status === AssignmentStatus.in_progress &&
						assignmentAndReport.assignment.status === AssignmentStatus.in_progress
							? assignmentAndReport.report.start_time
							: null
					}
				/>
			));
	};

	const handleDateConfirm = (date: Date) => {
		setSelectedDate(date);
	};

	const getDailyAssignmentDates = (): string[] => {
		if (!dailyAssignmentsAndReports) return [];

		return dailyAssignmentsAndReports.map(ar => ar.assignment.date);
	};

	const renderNoAssignments = () => {
		if (assignments && assignments.length === 0) {
			if (getFormatedDate(selectedDate) === getFormatedDate(new Date())) {
				return (
					<View style={styles.emptyStateContainer}>
						<Card variant={"default"} style={styles.noAssignmentCard}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<View style={styles.iconContainer}>
									<FontAwesome5
										name={"clock"}
										color={styles.iconColor.color}
										size={26}
									/>
								</View>
							</View>
							<Typography
								color="primary"
								variant="h4"
								style={{ textAlign: "center", marginBottom: 8 }}
							>
								{t("admin.noAssignmentsForToday")}
							</Typography>
							<Typography variant="body1" style={{ textAlign: "center" }}>
								{t("admin.enjoyTime")}
							</Typography>
						</Card>
					</View>
				);
			} else {
				return (
					<View style={styles.emptyStateContainer}>
						<Card variant={"default"} style={styles.noAssignmentCard}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<View style={styles.iconContainer}>
									<FontAwesome5
										name={"clock"}
										color={styles.iconColor.color}
										size={26}
									/>
								</View>
							</View>
							<Typography
								variant="h5"
								style={{ alignSelf: "center", marginBottom: 8 }}
							>
								{t("admin.noAssignmentsPlanned", {
									date: getFormatedDate(selectedDate),
								})}
							</Typography>
						</Card>
					</View>
				);
			}
		}
	};

	const assignments = DailyAssignmentsListRender();
	const assignmentDates = getDailyAssignmentDates();

	console.log("assignments " + assignments.length);
	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
			<View style={styles.page}>
				<View style={styles.sidebar}>
					<Calendar onConfirm={handleDateConfirm} assignedDates={assignmentDates} />
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
					{assignments.length === 0 ? (
						renderNoAssignments()
					) : (
						<View style={styles.scrollContainer}>{assignments}</View>
					)}
				</View>
			</View>

			{showReport && (
				<ModalContainer visible={showReport} onClose={() => setShowReport(false)}>
					<ReportForm
						onCancel={() => setShowReport(false)}
						onSubmit={handleReportSubmit}
					/>
				</ModalContainer>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	contentContainer: {
		paddingVertical: theme.spacing(2),
		paddingHorizontal: theme.spacing(3),
	},
	tasksContainer: {
		flex: 1,
		gap: theme.spacing(2),
		margin: { xs: 0, md: theme.spacing(3) },
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
		gap: { sm: theme.spacing(0), md: theme.spacing(6) },
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
	dateTaskContainer: {
		marginTop: theme.spacing(2),
	},
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
