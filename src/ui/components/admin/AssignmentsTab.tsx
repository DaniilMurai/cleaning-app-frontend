// src/ui/components/admin/AssignmentsTab.tsx
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { Button, Card } from "@/ui";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/Collapse";
import { DailyAssignmentResponse, LocationResponse } from "@/api/admin";

interface AssignmentsTabProps {
	locations: LocationResponse[];
	dailyAssignments: DailyAssignmentResponse[];
	dailyAssignmentsIsLoading: boolean;
	dailyAssignmentMutation: any;
	modal: any;
}

export default function AssignmentsTab({
	locations,
	dailyAssignments,
	dailyAssignmentsIsLoading,
	dailyAssignmentMutation,
	modal,
}: AssignmentsTabProps) {
	const { t } = useTranslation();

	// Состояния для управления развернутыми/свернутыми элементами
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});

	// Функции для обработки состояния развернутых элементов
	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant="contained">
						<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
					</Button>
				</View>

				{dailyAssignments &&
					locations &&
					!dailyAssignmentsIsLoading &&
					dailyAssignments.map(assignment => {
						const location = locations.find(l => l.id === assignment.location_id);

						if (!location) return null;

						return (
							<Card key={assignment.id} style={styles.card}>
								<TouchableOpacity
									style={styles.cardHeader}
									onPress={() => toggleAssignment(assignment.id)}
								>
									<View style={styles.headerWithIcon}>
										<FontAwesome5
											name={
												expandedAssignments[assignment.id]
													? "angle-down"
													: "angle-right"
											}
											size={16}
											color={styles.collapseIcon.color}
										/>
										<Typography variant="h5">
											{t("admin.dailyAssignment")} - {location.name}
										</Typography>
									</View>
									<View style={styles.actionButtons}>
										<Button variant="outlined">
											<FontAwesome5 name="edit" size={14} />
										</Button>
										<Button variant="outlined" style={styles.deleteButton}>
											<FontAwesome5 name="trash" size={14} />
										</Button>
									</View>
								</TouchableOpacity>

								<Collapse expanded={expandedAssignments[assignment.id]}>
									<Typography variant="subtitle2">
										{t("admin.assignmentDetails")}
									</Typography>
									<Typography>
										{t("admin.date")}: {assignment.date}
									</Typography>
									{assignment.admin_note && (
										<Typography>
											{t("admin.adminNote")}: {assignment.admin_note}
										</Typography>
									)}
									{assignment.user_note && (
										<Typography>
											{t("admin.userNote")}: {assignment.user_note}
										</Typography>
									)}
								</Collapse>
							</Card>
						);
					})}
			</ScrollView>
		</View>
	);
}
const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	tabContainer: {
		flexDirection: "row",
		backgroundColor: theme.colors.background.default,
		elevation: 4,
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	tab: {
		flex: 1,
		paddingVertical: theme.spacing(2),
		alignItems: "center",
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor:
			typeof theme.colors.primary === "object"
				? theme.colors.primary.main
				: theme.colors.primary,
	},
	tabText: {
		color:
			typeof theme.colors.text === "object" ? theme.colors.text.primary : theme.colors.text,
	},
	activeTabText: {
		color:
			typeof theme.colors.primary === "object"
				? theme.colors.primary.main
				: theme.colors.primary,
		fontWeight: "600",
	},
	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
	},
	mainButton: {
		paddingHorizontal: theme.spacing(2),
	},
	card: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		alignItems: "center",
		marginBottom: theme.spacing(1),
	},
	headerWithIcon: {
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	actionButtons: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	deleteButton: {
		borderColor: theme.colors.error.main,
		color: theme.colors.error.main,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	roomSection: {
		marginTop: theme.spacing(1),
	},
	roomHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
	},
	roomItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
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
	addButton: {
		marginTop: theme.spacing(1),
		alignSelf: "flex-start",
	},
	assignmentItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: theme.spacing(1),
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
	},
	assignmentActions: {
		marginTop: theme.spacing(2),
		alignItems: "flex-end",
	},
	emptyState: {
		fontStyle: "italic",
		color: theme.colors.text.secondary,
		marginVertical: theme.spacing(1),
	},
	iconColor: {
		color: theme.colors.primary.text,
	},
}));
