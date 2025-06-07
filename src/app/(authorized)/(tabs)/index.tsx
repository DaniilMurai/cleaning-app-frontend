import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Loading, ModalContainer } from "@/ui";
import {
	AssignmentStatus,
	CreateReport,
	UpdateReport,
	useCreateReport,
	useGetDailyAssignment,
	useUpdateReport,
} from "@/api/client";
import useAuth from "@/core/context/AuthContext";
import ReportForm from "@/ui/forms/common/ReportForm";
import AssignmentCard from "@/ui/components/index/AssignmentCard";

export default function DailyAssignmentsList() {
	const { user } = useAuth();

	const {
		data: dailyAssignments,
		isLoading: dailyAssignmentIsLoading,
		refetch: dailyAssignmentRefetch,
	} = useGetDailyAssignment();

	const createReportMutation = useCreateReport();
	const updateReportMutation = useUpdateReport();

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
				setReportId(report.id);
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

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollContainer}>
				{dailyAssignments?.map(assignment => (
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
				))}
			</ScrollView>

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
