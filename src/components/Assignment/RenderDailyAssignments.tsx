import { Button, Card } from "@/ui";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../ui/common/Typography";
import Collapse from "../../ui/common/Collapse";
import React, { useEffect, useState } from "react";
import {
	DailyAssignmentResponse,
	useCheckAssignmentGroup,
	useGetDailyAssignments,
} from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import NoAssignments from "@/components/Assignment/RenderNoAssignments";
import dayjs from "dayjs";
import { keepPreviousData } from "@tanstack/query-core";

interface props {
	selectedDate: Date;
	setSelectedAssignment: (assignment: DailyAssignmentResponse | null) => void;
	modal: any;
}

export default function RenderDailyAssignments({
	selectedDate,
	setSelectedAssignment,
	modal,
}: props) {
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});

	const { t } = useTranslation();
	const [assignmentIdToCheck, setAssignmentIdToCheck] = useState<number | null>(null);

	const { data: dailyAssignments } = useGetDailyAssignments(
		{
			dates: [dayjs(selectedDate).format("YYYY-MM-DD")],
		},
		{
			query: {
				enabled: !!selectedDate,
				placeholderData: keepPreviousData,
			},
		}
	);

	const { data: assignmentGroup } = useCheckAssignmentGroup(
		{ daily_assignment_id: assignmentIdToCheck ?? 0 },
		{
			query: {
				enabled: assignmentIdToCheck !== null,
			},
		}
	);

	useEffect(() => {
		console.log("assignmentGroup: ", assignmentGroup);
		if (!assignmentGroup) return;
		if (assignmentGroup && assignmentGroup.assignments_amount > 1) {
			modal.openModal("deleteAssignmentGroup");
		} else {
			modal.openModal("deleteAssignment");
		}
		setAssignmentIdToCheck(null);
	}, [assignmentGroup]);

	// Функции для обработки состояния развернутых элементов
	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
	};
	console.log("rerender RenderDailyAssignments");

	const render = () => {
		if (!dailyAssignments) return [];
		console.log("rerender render");
		return dailyAssignments.map(assignment => {
			return (
				<Card key={assignment.id} style={styles.card}>
					<TouchableOpacity
						style={styles.cardHeader}
						onPress={() => toggleAssignment(assignment.id)}
					>
						<View style={styles.headerWithIcon}>
							{(assignment.user_note || assignment.admin_note) && (
								<FontAwesome5
									name={
										expandedAssignments[assignment.id]
											? "angle-down"
											: "angle-right"
									}
									size={16}
									color={styles.collapseIcon.color}
								/>
							)}
							<View style={{ flexDirection: "column" }}>
								<Typography variant="h5">
									{assignment.location?.name ?? "Unknown Location"}
								</Typography>
								<Typography>
									{t("profile.username")}: {assignment.user.full_name}
								</Typography>
							</View>
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
									setAssignmentIdToCheck(assignment.id);
									// modal.openModal("deleteAssignment");
								}}
							>
								<FontAwesome5 name="trash" size={14} />
							</Button>
						</View>
					</TouchableOpacity>

					<Collapse
						expanded={
							assignment.user_note || assignment.admin_note
								? expandedAssignments[assignment.id]
								: false
						}
					>
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

	return dailyAssignments?.length === 0 ? (
		<NoAssignments selectedDate={selectedDate} />
	) : (
		render()
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
