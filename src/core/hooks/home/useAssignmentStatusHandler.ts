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
		reportid: number | null,
		attemptComplete?: boolean
	) => {
		if (!userId) return;

		// ТОЛЬКО для attemptComplete (открытие модалки)
		// Сохраняем временные метки для использования в отчете
		setAssignmentId(assignmentId);
		setStartTime(newStartTime);
		setEndTime(newEndTime);

		if (attemptComplete) {
			setTotalTime(totalTime);
			setShowReport(true);

			return; // Не делаем запросы к API
		}

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

				const updateAssignmentResponse = await updateAssignmentMutation.mutateAsync({
					params: { assignment_id: assignmentId, status: newStatus },
				});
				setAssignmentAndReport({
					assignment: updateAssignmentResponse,
					report: report,
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

			if (attemptComplete) {
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
		console.log(
			" userid: " +
				userId +
				" startTime: " +
				startTime +
				" endTime: " +
				endTime +
				" reportId: " +
				reportId +
				" assignmentId: " +
				assignmentId
		);
		if (!userId || !startTime || !endTime || !reportId || !assignmentId) {
			return;
		}

		if (startTime > endTime) {
			console.log("startTime: " + startTime + "endtime: " + endTime);
			return;
		}

		try {
			await updateAssignmentMutation.mutateAsync({
				params: { assignment_id: assignmentId, status: data.status },
			});
			const response = await updateReportMutation.mutateAsync({
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

			console.log("response: " + response);

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
