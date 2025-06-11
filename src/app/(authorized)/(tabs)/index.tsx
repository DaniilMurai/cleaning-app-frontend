import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Loading, ModalContainer, Typography } from "@/ui";
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
import { formatToDate, getDateFromMs } from "@/core/utils/dateUtils";

export default function DailyAssignmentsList() {
	const { user } = useAuth();

	const {
		data: dailyAssignmentsAndReports,
		isLoading: dailyAssignmentsAndReportsIsLoading,
		refetch: dailyAssignmentsAndReportsRefetch,
	} = useGetDailyAssignmentsAndReports();

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

	const DailyAssignmentsListRender = () => {
		if (!dailyAssignmentsAndReports) return <Typography>No assignments for you</Typography>;
		const timestamp = new Date();
		const date = getDateFromMs(timestamp);
		console.log(date);

		const assignments = dailyAssignmentsAndReports
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

		if (assignments.length < 1) return <Typography>No assignments for today</Typography>;

		return assignments;
	};

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>{DailyAssignmentsListRender()}</ScrollView>

			{showReport && (
				<ModalContainer visible={showReport} onClose={() => setShowReport(false)}>
					<ReportForm
						onCancel={() => setShowReport(false)}
						onSubmit={handleReportSubmit}
					/>
				</ModalContainer>
			)}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
}));
