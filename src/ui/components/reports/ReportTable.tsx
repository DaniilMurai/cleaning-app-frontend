import {
	AdminReadUser,
	DailyAssignmentResponse,
	LocationResponse,
	ReportResponse,
} from "@/api/admin";
import React from "react";
import { StyleSheet } from "react-native-unistyles";
import { FlatList, View } from "react-native";
import { Typography } from "@/ui";
import { formatTime, formatToDate, formatToDateTime, formatToTime } from "@/core/utils/dateUtils";

interface Props {
	reports: ReportResponse[];
	density?: "normal" | "dense";
	users?: AdminReadUser[];
	assignments?: DailyAssignmentResponse[];
	locations?: LocationResponse[];
}

export default function ReportsTable({
	reports,
	density = "normal",
	assignments,
	users = [],
	locations = [],
}: Props) {
	const rowHeight = density === "dense" ? 32 : 48;

	const getUserFullName = (report: ReportResponse) => {
		const user = users.find(u => report.user_id === u.id);
		return user?.full_name ?? "Unknown User";
	};

	const getAssignment = (report: ReportResponse) => {
		return assignments?.find(a => report.daily_assignment_id === a.id) ?? null;
	};

	const getLocationName = (assignment: DailyAssignmentResponse | null) => {
		if (!assignment) return "—";
		const location = locations.find(l => l.id === assignment.location_id);
		return location?.name ?? "Unknown Location";
	};

	const renderHeader = () => (
		<View style={[styles.row, styles.header, { height: rowHeight }]}>
			<Typography style={[styles.cell, { flex: 2 }]}>Username</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Location</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Date</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Status</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Start</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>End</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Duration</Typography>
		</View>
	);

	const renderItem = ({ item }: { item: ReportResponse }) => {
		const assignment = getAssignment(item);
		const date = assignment ? formatToDateTime(assignment.date) : "—";
		const locationName = getLocationName(assignment);
		const durationInMs = item.duration_seconds ? item.duration_seconds * 1000 : 0;
		const duration = formatTime(durationInMs);

		let start_time = "-";
		if (item.start_time && assignment) {
			if (formatToDate(assignment.date) === formatToDate(item.start_time)) {
				start_time = formatToTime(item.start_time);
			} else {
				start_time = formatToDateTime(item.start_time);
			}
		}

		let end_time = "-";
		if (item.end_time && assignment) {
			if (formatToDate(assignment.date) === formatToDate(item.end_time)) {
				end_time = formatToTime(item.end_time);
			} else {
				end_time = formatToDateTime(item.end_time);
			}
		}

		return (
			<View style={[styles.row, { height: rowHeight }]}>
				<Typography style={[styles.cell, { flex: 2 }]}>{getUserFullName(item)}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{locationName}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{date}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{item.status}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{start_time}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{end_time}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{duration}</Typography>
			</View>
		);
	};

	return (
		<FlatList
			data={reports}
			keyExtractor={item => item.id.toString()}
			ListHeaderComponent={renderHeader}
			stickyHeaderIndices={[0]}
			renderItem={renderItem}
		/>
	);
}

const styles = StyleSheet.create(theme => ({
	row: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border,
		backgroundColor: theme.colors.background.main,
	},
	header: {
		backgroundColor: theme.colors.background.default,
	},
	cell: {
		paddingHorizontal: 8,
		fontSize: 14,
	},
}));
