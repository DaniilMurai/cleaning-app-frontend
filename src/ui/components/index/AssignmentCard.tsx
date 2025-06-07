import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Card, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { useTranslation } from "react-i18next";
import TaskTimer from "@/ui/components/date/TaskTimer";
import { formatToDateTime } from "@/core/utils/dateUtils";
import RoomSection from "./RoomSection";
import { AssignmentStatus, DailyAssignmentForUserResponse } from "@/api/client";

interface Props {
	assignment: DailyAssignmentForUserResponse;
	onStatusChange?: (
		status: AssignmentStatus,
		totalTime: number,
		startTime: number | null,
		endTime: number | null
	) => void;
}

export default function AssignmentCard({ assignment, onStatusChange }: Props) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => setIsExpanded(prev => !prev);

	return (
		<Card style={styles.card}>
			<TouchableOpacity style={styles.cardHeader} onPress={toggleExpand}>
				<View style={styles.wrappableText}>
					<View style={styles.headerWithIcon}>
						<FontAwesome5
							name={isExpanded ? "angle-down" : "angle-right"}
							size={16}
							color={styles.collapseIcon.color}
						/>
						<Typography variant="h5" style={styles.wrappableText} numberOfLines={0}>
							{assignment.location.name} - {formatToDateTime(assignment.date)}
						</Typography>
					</View>
					<Typography variant="body1" style={styles.wrappableText} numberOfLines={0}>
						{t("components.dailyAssignmentsList.address")}:{" "}
						{assignment.location.address}
					</Typography>
					<Typography variant="subtitle2" style={styles.wrappableText}>
						{t("admin.assignmentDetails")}
					</Typography>
					<Typography style={styles.wrappableText} numberOfLines={0}>
						{t("admin.date")}: {formatToDateTime(assignment.date)}
					</Typography>
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
				<TaskTimer onStatusChange={onStatusChange} />
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
}));
