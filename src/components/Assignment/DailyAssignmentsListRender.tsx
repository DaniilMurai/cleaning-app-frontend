import React from "react";
import AssignmentCard from "@/components/home/AssignmentCard";
import { AssignmentReportResponse, AssignmentStatus } from "@/api/client";

interface Props {
	assignments: AssignmentReportResponse[];
	onStatusChange: (
		assignmentId: number,
		newStatus: AssignmentStatus,
		totalTime: number,
		newStartTime: number | null,
		newEndTime: number | null,
		attemptComplete?: boolean
	) => void;
}

const statusOrder: Record<AssignmentStatus, number> = {
	in_progress: 0,
	not_started: 1,
	expired: 2,
	not_completed: 3,
	partially_completed: 4,
	completed: 5,
};

export default function DailyAssignmentsListRender({ assignments, onStatusChange }: Props) {
	if (!assignments.length) return [];

	const sortedAssignments = [...assignments].sort(
		(a, b) => statusOrder[a.assignment.status] - statusOrder[b.assignment.status]
	);

	sortedAssignments.map(assignmentAndReport => {
		console.log(
			"status in DailyAssignmentsListRender: " +
				assignmentAndReport.assignment.status +
				" start_time: " +
				assignmentAndReport.assignment.start_time
		);
	});

	return sortedAssignments.map(assignmentAndReport => (
		<AssignmentCard
			key={assignmentAndReport.assignment.id}
			assignment={assignmentAndReport.assignment}
			onStatusChange={(newStatus, totalTime, newStartTime, newEndTime, attemptComplete) =>
				onStatusChange(
					assignmentAndReport.assignment.id,
					newStatus,
					totalTime,
					newStartTime,
					newEndTime,
					attemptComplete
				)
			}
			initialStatus={assignmentAndReport.assignment.status}
			alreadyDoneTime={
				assignmentAndReport.report?.duration_seconds ??
				assignmentAndReport.assignment?.duration_seconds ??
				0
			}
			startTimeBackend={
				assignmentAndReport.assignment &&
				assignmentAndReport.assignment.status === AssignmentStatus.in_progress
					? assignmentAndReport.assignment.start_time
					: null
			}
		/>
	));
}
