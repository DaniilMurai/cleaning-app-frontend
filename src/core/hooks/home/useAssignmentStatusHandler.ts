import { useEffect, useState } from "react";
import {
	AssignmentReportResponse,
	AssignmentStatus,
	CreateReport,
	UpdateReport,
	useCreateReport,
	useUpdateDailyAssignmentStatus,
	useUpdateReport,
} from "@/api/client";
import { AssignmentAndReportStorage, ReportIdStorage } from "@/core/auth/storage";

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

	useEffect(() => {
		const loadSavedData = async () => {
			try {
				const savedData = await AssignmentAndReportStorage.get();
				if (savedData) {
					const parsedData = JSON.parse(savedData);
					setAssignmentAndReport(parsedData);
					setReportId(parsedData?.report?.id || null);
					setAssignmentId(parsedData?.assignment?.id || null);

					if (parsedData?.report?.start_time) {
						setStartTime(Number(parsedData.report.start_time));
					}
					if (parsedData?.report?.end_time) {
						setEndTime(Number(parsedData.report.end_time));
					}
				}
			} catch (error) {
				console.error("Error loading saved assignment and report:", error);
			}
		};

		loadSavedData();
	}, []);

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
				const newData = {
					assignment: updateAssignmentResponse,
					report: report,
				};
				setAssignmentAndReport(newData);
				setReportId(report.id);
				await AssignmentAndReportStorage.set(JSON.stringify(newData));
				await ReportIdStorage.set(report.id.toString());
				await dailyAssignmentsAndReportsRefetch();
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

				await ReportIdStorage.set(reportid.toString());

				const newData = {
					assignment: updateAssignmentResponse,
					report: updateReportResponse,
				};

				setAssignmentAndReport(newData);
				await AssignmentAndReportStorage.set(JSON.stringify(newData));
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
			await AssignmentAndReportStorage.remove();
			await ReportIdStorage.remove();
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
