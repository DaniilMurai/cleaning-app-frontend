import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Card, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { useTranslation } from "react-i18next";
import TaskTimer from "@/ui/date/TaskTimer";
import { formatToDate, getFormatedDate } from "@/core/utils/dateUtils";
import RoomSection from "./RoomSection";
import { AssignmentStatus, DailyAssignmentForUserResponse } from "@/api/client";
import GetStatusBadge from "@/components/reports/StatusBadge";

interface Props {
	assignment: DailyAssignmentForUserResponse;
	onStatusChange?: (
		status: AssignmentStatus,
		totalTime: number,
		startTime: number | null,
		endTime: number | null,
		attemptComplete?: boolean
	) => void;
	initialStatus?: AssignmentStatus;
	alreadyDoneTime?: number;
	startTimeBackend?: string | null;
}

export default function AssignmentCard({
	assignment,
	onStatusChange,
	alreadyDoneTime,
	initialStatus,
	startTimeBackend,
}: Props) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);
	const toggleExpand = () => setIsExpanded(prev => !prev);

	const { theme } = useUnistyles();

	const [status, setStatus] = useState<AssignmentStatus>(initialStatus || assignment.status);

	console.log("assignment in AssignmentCard: " + assignment.status + " " + assignment.start_time);

	const handleStatusChange = (
		status: AssignmentStatus,
		totalTime: number,
		startTime: number | null,
		endTime: number | null,
		attemptComplete?: boolean
	) => {
		// Не обновляем статус при attemptComplete
		if (!attemptComplete) {
			setStatus(status);
		}

		if (onStatusChange) {
			onStatusChange(status, totalTime, startTime, endTime, attemptComplete);
		}
	};

	useEffect(() => {
		setStatus(assignment.status);
	}, [assignment.status]);

	styles.useVariants({ status });

	return (
		<Card variant={"contained"} style={styles.card}>
			<TouchableOpacity style={styles.cardHeader} onPress={toggleExpand}>
				<View style={[styles.wrappableText, styles.dataContainer]}>
					<View
						style={{
							flex: 1,
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "flex-end",
						}}
					>
						<View style={styles.headerWithIcon}>
							<FontAwesome5
								name={isExpanded ? "angle-down" : "angle-right"}
								size={16}
								color={styles.collapseIcon.color}
							/>
							<Typography variant="h5" style={styles.wrappableText} numberOfLines={0}>
								{assignment.location.name}
							</Typography>
						</View>
						<GetStatusBadge status={status} />
					</View>
					{!!assignment.location.address && (
						<Typography variant="body1" style={styles.wrappableText} numberOfLines={0}>
							{t("components.dailyAssignmentsList.address")}:{" "}
							{assignment.location.address}
						</Typography>
					)}
					{assignment.admin_note && (
						<Typography style={styles.wrappableText} numberOfLines={0}>
							{t("admin.adminNote")}: {assignment.admin_note}
						</Typography>
					)}
					{assignment.user_note && (
						<Typography style={styles.wrappableText} numberOfLines={0}>
							{t("admin.userNote")}: {assignment.user_note}
						</Typography>
					)}
				</View>
			</TouchableOpacity>
			<Collapse expanded={isExpanded}>
				{formatToDate(assignment.date) === getFormatedDate(new Date()) && (
					<TaskTimer
						onStatusChange={handleStatusChange}
						alreadyDoneTime={alreadyDoneTime}
						initialStatus={initialStatus}
						startTimeBackend={startTimeBackend}
					/>
				)}
				<View style={styles.divider} />
				<Typography variant="subtitle1" style={styles.wrappableText}>
					{t("admin.rooms")}
				</Typography>
				{assignment.rooms && assignment.rooms?.length > 0 ? (
					assignment.rooms.map(room => (
						<RoomSection key={room.id} assignment={assignment} room={room} />
					))
				) : (
					<Typography style={styles.emptyState}>{t("admin.noRooms")}</Typography>
				)}
			</Collapse>
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	card: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		borderLeftWidth: 5,
		boxShadow: "none",
		variants: {
			status: {
				not_started: {
					borderLeftColor: theme.colors.not_started.main,
				},
				in_progress: {
					borderLeftColor: theme.colors.progress.main,
				},
				completed: {
					borderLeftColor: theme.colors.success.main,
				},
				partially_completed: {
					borderLeftColor: theme.colors.warning.main,
				},
				not_completed: {
					borderLeftColor: theme.colors.error.main,
				},
				expired: {
					borderLeftColor: theme.colors.error.main,
				},
			},
		},
	},
	borderLeftColor: {
		borderLeftColor: theme.colors.success.main,
	},
	dataContainer: {
		flex: 1,
		gap: theme.spacing(1),
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerWithIcon: {
		flexDirection: "row",
		alignItems: "center",

		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	assignmentDetails: {
		marginBottom: theme.spacing(2),
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	wrappableText: {
		flexShrink: 1,
		flexWrap: "wrap",
	},
	emptyState: {
		fontStyle: "italic",
		color: theme.colors.text.secondary,
		marginVertical: theme.spacing(1),
	},
	timeContainer: {
		flexDirection: "row",
		gap: theme.spacing(1),
		alignItems: "center",
	},
	container: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	clockIcon: {
		color: theme.colors.text.disabled,
	},
}));
