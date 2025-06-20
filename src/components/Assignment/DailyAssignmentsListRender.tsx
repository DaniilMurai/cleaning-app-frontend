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
		reportid: number | null
	) => void;
}

const statusOrder: Record<AssignmentStatus, number> = {
	in_progress: 0,
	not_started: 1,
	not_completed: 2,
	partially_completed: 3,
	completed: 4,
};

export default function DailyAssignmentsListRender({ assignments, onStatusChange }: Props) {
	if (!assignments.length) return [];

	const sortedAssignments = [...assignments].sort(
		(a, b) => statusOrder[a.assignment.status] - statusOrder[b.assignment.status]
	);

	return sortedAssignments.map(assignmentAndReport => (
		<AssignmentCard
			key={assignmentAndReport.assignment.id}
			assignment={assignmentAndReport.assignment}
			onStatusChange={(newStatus, totalTime, newStartTime, newEndTime) =>
				onStatusChange(
					assignmentAndReport.assignment.id,
					newStatus,
					totalTime,
					newStartTime,
					newEndTime,
					assignmentAndReport.report?.id || null
				)
			}
			initialStatus={assignmentAndReport.assignment.status}
			alreadyDoneTime={assignmentAndReport.report?.duration_seconds ?? 0}
			startTimeBackend={
				assignmentAndReport.report &&
				assignmentAndReport.report.status === AssignmentStatus.in_progress &&
				assignmentAndReport.assignment.status === AssignmentStatus.in_progress
					? assignmentAndReport.report.start_time
					: null
			}
		/>
	));
}
