import { useState } from "react";
import {
	AssignmentStatus,
	DailyAssignmentForUserResponse,
	DailyAssignmentForUserUpdate,
	useCreateReport,
	useUpdateDailyAssignment,
} from "@/api/client";
import { AssignmentStorage } from "@/core/auth/storage";
import { convertMsToUTC } from "@/core/utils/dateUtils";

interface StatusHandlerParams {
	dailyAssignmentsAndReportsRefetch: () => Promise<any>;
	userId?: number;
}

export default function useAssignmentStatusHandler({
	dailyAssignmentsAndReportsRefetch,
	userId,
}: StatusHandlerParams) {
	const [assignmentId, setAssignmentId] = useState<number | null>(null);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [showReport, setShowReport] = useState(false);
	const [totalTime, setTotalTime] = useState(0);

	const [assignment, setAssignment] = useState<DailyAssignmentForUserResponse | null>(null);

	const createReportMutation = useCreateReport();
	const updateAssignmentMutation = useUpdateDailyAssignment();

	const handleStatusChange = async (
		assignmentId: number,
		newStatus: AssignmentStatus,
		totalTime: number,
		newStartTime: number | null,
		newEndTime: number | null,
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
			console.log("newStartTime: " + newStartTime);
			const updateAssignmentData: DailyAssignmentForUserUpdate = {
				start_time: newStartTime ? convertMsToUTC(newStartTime) : null,
				end_time: newEndTime ? convertMsToUTC(newEndTime) : null,
				status: newStatus,
			};

			const updateAssignmentResponse = await updateAssignmentMutation.mutateAsync({
				params: { assignment_id: assignmentId },
				data: updateAssignmentData,
			});

			console.log(
				"Server response in useAssignmentStatusHandler:",
				updateAssignmentResponse.id,
				updateAssignmentResponse.status,
				updateAssignmentResponse.start_time
			);

			setAssignment(updateAssignmentResponse);
			await AssignmentStorage.set(JSON.stringify(updateAssignmentResponse));

			await dailyAssignmentsAndReportsRefetch();
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
				" assignmentId: " +
				assignmentId
		);
		if (!userId || !startTime || !endTime || !assignmentId) {
			return;
		}

		if (startTime > endTime) {
			console.log("startTime: " + startTime + "endtime: " + endTime);
			return;
		}

		try {
			const updateAssignmentData: DailyAssignmentForUserUpdate = {
				start_time: convertMsToUTC(startTime),
				end_time: convertMsToUTC(endTime),
				status: data.status,
			};

			await updateAssignmentMutation.mutateAsync({
				params: { assignment_id: assignmentId },
				data: updateAssignmentData,
			});

			const response = await createReportMutation.mutateAsync({
				data: {
					daily_assignment_id: assignmentId,
					user_id: userId,
					message: data?.text,
					media_links: data?.media,
					start_time: convertMsToUTC(startTime),
					end_time: convertMsToUTC(endTime),
					status: data.status,
				},
			});

			console.log("response in useAssignmentStatusHandler: " + response);
			await AssignmentStorage.remove();
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
		assignment,
		setShowReport,
	};
}
