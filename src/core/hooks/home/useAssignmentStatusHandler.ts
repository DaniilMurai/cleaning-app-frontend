import { useState } from "react";
import {
	AssignmentReportResponse,
	AssignmentStatus,
	CreateReport,
	UpdateReport,
	useCreateReport,
	useUpdateDailyAssignmentStatus,
	useUpdateReport,
} from "@/api/client";

interface StatusHandlerParams {
	dailyAssignmentsAndReportsRefetch: () => Promise<any>;
	userId?: number;
}

export default function useAssignmentStatusHandler({
	dailyAssignmentsAndReportsRefetch,
	userId,
}: StatusHandlerParams) {
	const [reportId, setReportId] = useState<number | null>(null);
	const [assignmentId, setAssignmentId] = useState<number | null>(null);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [showReport, setShowReport] = useState(false);
	const [totalTime, setTotalTime] = useState(0);

	const [assignmentAndReport, setAssignmentAndReport] = useState<AssignmentReportResponse | null>(
		null
	);

	const createReportMutation = useCreateReport();
	const updateReportMutation = useUpdateReport();
	const updateAssignmentMutation = useUpdateDailyAssignmentStatus();

	const handleStatusChange = async (
		assignmentId: number,
		newStatus: AssignmentStatus,
		totalTime: number,
		newStartTime: number | null,
		newEndTime: number | null,
		reportid: number | null
	) => {
		if (!userId) return;

		// Сохраняем временные метки для использования в отчете
		setAssignmentId(assignmentId);
		setStartTime(newStartTime);
		setEndTime(newEndTime);

		try {
			if (reportid === null) {
				const payload: CreateReport = {
					daily_assignment_id: assignmentId,
					user_id: userId,
					status: newStatus,
					start_time: newStartTime?.toString() || null,
					end_time: newEndTime?.toString() || null,
				};

				const report = await createReportMutation.mutateAsync({ data: payload });

				await updateAssignmentMutation.mutateAsync({
					params: { assignment_id: assignmentId, status: newStatus },
				});

				await dailyAssignmentsAndReportsRefetch();
				setReportId(report.id);
			} else {
				const payload: UpdateReport = {
					daily_assignment_id: assignmentId,
					user_id: userId,
					status: newStatus,
					start_time: newStartTime?.toString(),
					end_time: newEndTime?.toString(),
				};

				const [updateReportResponse, updateAssignmentResponse] = await Promise.all([
					updateReportMutation.mutateAsync({
						data: payload,
						params: { report_id: reportid },
					}),
					updateAssignmentMutation.mutateAsync({
						params: { assignment_id: assignmentId, status: newStatus },
					}),
				]);

				setAssignmentAndReport({
					assignment: updateAssignmentResponse,
					report: updateReportResponse,
				});
				setReportId(reportid);
			}

			if (
				newStatus === AssignmentStatus.completed ||
				newStatus === AssignmentStatus.partially_completed
			) {
				setTotalTime(totalTime);
				setShowReport(true);
			}
		} catch (error) {
			console.error("Error updating report:", error);
		}
	};

	const handleReportSubmit = async (data: {
		text?: string;
		media?: string[];
		status: AssignmentStatus;
	}) => {
		if (!userId || !startTime || !endTime || !reportId || !assignmentId) {
			return;
		}

		if (startTime > endTime) {
			return;
		}

		try {
			await updateReportMutation.mutateAsync({
				params: { report_id: reportId },
				data: {
					daily_assignment_id: assignmentId,
					user_id: userId,
					message: data?.text,
					media_links: data?.media,
					start_time: startTime.toString(),
					end_time: endTime.toString(),
					status: data.status,
				},
			});
			setShowReport(false);
			await dailyAssignmentsAndReportsRefetch();
		} catch (error) {
			console.error("Error submitting report:", error);
		}
	};

	return {
		handleStatusChange,
		handleReportSubmit,
		showReport,
		totalTime,
		assignmentAndReport,
		setShowReport,
	};
}
