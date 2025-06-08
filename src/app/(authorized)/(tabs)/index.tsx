import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Loading, ModalContainer, Typography } from "@/ui";
import {
	AssignmentStatus,
	CreateReport,
	UpdateReport,
	useCreateReport,
	useGetDailyAssignments,
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
		data: dailyAssignments,
		isLoading: dailyAssignmentIsLoading,
		refetch: dailyAssignmentRefetch,
	} = useGetDailyAssignments();

	const createReportMutation = useCreateReport();
	const updateReportMutation = useUpdateReport();
	const updateAssignmentMutation = useUpdateDailyAssignmentStatus();
	//TODO сделать если задание выполнено оно весит день выполненым, его нельзя опять начать выполнять
	const [reportId, setReportId] = useState<number | null>(null);
	const [status, setStatus] = useState<AssignmentStatus>("not_started");
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [showReport, setShowReport] = useState(false);

	const handleStatusChange = async (
		assignmentId: number,
		newStatus: AssignmentStatus,
		totalTime: number,
		newStartTime: number | null,
		newEndTime: number | null
	) => {
		if (!user?.id) return;

		setStatus(newStatus);
		setStartTime(newStartTime);
		setEndTime(newEndTime);

		try {
			if (!reportId) {
				const payload: CreateReport = {
					daily_assignment_id: assignmentId,
					user_id: user.id,
					status: newStatus,
					start_time: newStartTime?.toString(),
					end_time: newEndTime?.toString(),
				};
				const report = await createReportMutation.mutateAsync({ data: payload });
				await updateAssignmentMutation.mutateAsync({
					params: {
						assignment_id: assignmentId,
						status: status,
					},
				});

				setReportId(report.id);

				// await dailyAssignmentRefetch(); //TODO хз надо или не посмотрю
			} else {
				const payload: UpdateReport = {
					daily_assignment_id: assignmentId,
					user_id: user.id,
					status: newStatus,
					start_time: newStartTime?.toString(),
					end_time: newEndTime?.toString(),
				};
				await updateReportMutation.mutateAsync({
					data: payload,
					params: { report_id: reportId },
				});
				await updateAssignmentMutation.mutateAsync({
					params: {
						assignment_id: assignmentId,
						status: newStatus,
					},
				});
				// await dailyAssignmentRefetch(); //TODO хз надо или не посмотрю
			}

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
		if (!user || !startTime || !endTime || !reportId) return;

		try {
			await updateReportMutation.mutateAsync({
				params: { report_id: reportId },
				data: {
					daily_assignment_id: dailyAssignments?.[0]?.id, // Assuming single assignment for simplicity
					user_id: user.id,
					message: data?.text,
					media_links: data?.media,
					start_time: startTime.toString(),
					end_time: endTime.toString(),
					status,
				},
			});
			await dailyAssignmentRefetch();
			setShowReport(false);
		} catch (error) {
			console.error("Error submitting report:", error);
		}
	};

	if (dailyAssignmentIsLoading) {
		return <Loading />;
	}

	const DailyAssignmentsListRender = () => {
		if (!dailyAssignments) return <Typography>No assignments for you</Typography>;
		const timestamp = new Date();
		const date = getDateFromMs(timestamp);
		console.log(date);

		const assignments = dailyAssignments
			.filter(
				assignment =>
					formatToDate(assignment.date) === date &&
					assignment.status !== AssignmentStatus.completed &&
					assignment.status !== AssignmentStatus.partially_completed
			)

			.map(assignment => (
				<AssignmentCard
					key={assignment.id}
					assignment={assignment}
					onStatusChange={(newStatus, totalTime, newStartTime, newEndTime) =>
						handleStatusChange(
							assignment.id,
							newStatus,
							totalTime,
							newStartTime,
							newEndTime
						)
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
						taskId={dailyAssignments?.[0]?.id} // Assuming single assignment for simplicity
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
