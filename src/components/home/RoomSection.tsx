import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { useTranslation } from "react-i18next";
import { DailyAssignmentForUserResponse, RoomResponse } from "@/api/client";

interface Props {
	assignment: DailyAssignmentForUserResponse;
	room: RoomResponse;
}

export default function RoomSection({ assignment, room }: Props) {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);
	const toggleExpand = () => setIsExpanded(prev => !prev);

	const roomTasks = assignment.assigned_tasks?.filter(task => task.room.id === room.id);
	
	return (
		<View style={styles.roomSection}>
			<TouchableOpacity style={styles.roomHeader} onPress={toggleExpand}>
				<View style={styles.headerWithIcon}>
					<FontAwesome5
						name={isExpanded ? "angle-down" : "angle-right"}
						size={14}
						color={styles.collapseIcon.color}
					/>
					<Typography style={styles.wrappableText}>{room.name}</Typography>
				</View>
			</TouchableOpacity>
			<Collapse expanded={isExpanded}>
				<View style={styles.roomTasks}>
					<Typography variant="subtitle2" style={styles.wrappableText}>
						{t("admin.tasks")}
					</Typography>
					{roomTasks && roomTasks.length > 0 ? (
						roomTasks.map(task => (
							<View key={task.id} style={styles.roomTaskItem}>
								<Typography style={styles.wrappableText}>
									{task.task.title}
								</Typography>
							</View>
						))
					) : (
						<Typography style={styles.emptyState}>{t("admin.noTasks")}</Typography>
					)}
				</View>
			</Collapse>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	roomSection: {
		marginTop: theme.spacing(1),
	},
	roomHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
	},
	headerWithIcon: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	roomTasks: {
		paddingLeft: theme.spacing(4),
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},
	roomTaskItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
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
