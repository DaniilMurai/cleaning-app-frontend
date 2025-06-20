import { formatToDate, getFormatedDate } from "@/core/utils/dateUtils";
import { Button, Card } from "@/ui";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../ui/common/Typography";
import Collapse from "../../ui/common/Collapse";
import React, { useState } from "react";
import { AdminReadUser, DailyAssignmentResponse, LocationResponse } from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import NoAssignments from "@/components/Assignment/RenderNoAssignments";

interface props {
	dailyAssignments: DailyAssignmentResponse[];
	selectedDate: Date;
	locations: LocationResponse[];
	users?: AdminReadUser[];
	setSelectedAssignment: (assignment: DailyAssignmentResponse | null) => void;
	modal: any;
}

export default function RenderDailyAssignments({
	dailyAssignments,
	selectedDate,
	locations,
	setSelectedAssignment,
	users,
	modal,
}: props) {
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});

	const { t } = useTranslation();

	// Функции для обработки состояния развернутых элементов
	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const getUserById = (id: number) => {
		if (!users) return null;
		return users.find(u => u.id === id);
	};

	const render = () => {
		console.log(dailyAssignments);
		if (!dailyAssignments) return [];
		const date = selectedDate ? getFormatedDate(selectedDate) : getFormatedDate(new Date());

		console.log(date);
		return dailyAssignments
			.filter(assignment => formatToDate(assignment.date) == date)
			.map(assignment => {
				const location = locations.find(l => l.id === assignment.location_id);
				console.log("location", location);

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
									{location?.name ?? "Unknown Location"}
								</Typography>
							</View>
							<View style={styles.actionButtons}>
								<Button
									variant="outlined"
									onPress={() => {
										setSelectedAssignment(assignment);
										modal.openModal("editAssignment");
									}}
								>
									<FontAwesome5 name="edit" size={14} />
								</Button>
								<Button
									variant="outlined"
									style={styles.deleteButton}
									onPress={() => {
										setSelectedAssignment(assignment);
										modal.openModal("deleteAssignment");
									}}
								>
									<FontAwesome5 name="trash" size={14} />
								</Button>
							</View>
						</TouchableOpacity>

						<Collapse expanded={expandedAssignments[assignment.id]}>
							<Typography>
								{t("profile.username")}:{" "}
								{getUserById(assignment.user_id)?.full_name ||
									getUserById(assignment.user_id)?.full_name}
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
			});
	};

	const assignments = render();

	return assignments.length === 0 ? <NoAssignments selectedDate={selectedDate} /> : render();
}

const styles = StyleSheet.create(theme => ({
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
}));
