// src/ui/components/admin/AssignmentsTab.tsx
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/common/Typography";
import { Button, Card, ModalContainer } from "@/ui";
import { useTranslation } from "react-i18next";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { AdminReadUser, DailyAssignmentResponse, LocationResponse } from "@/api/admin";
import {
	CreateDailyAssignmentForm,
	DeleteDailyAssignmentConfirm,
	EditDailyAssignmentForm,
} from "@/ui/forms/common/DailyAssignmentForms";
import { formatToDateTime } from "@/core/utils/dateUtils";

interface AssignmentsTabProps {
	locations: LocationResponse[];
	dailyAssignments: DailyAssignmentResponse[];
	users?: AdminReadUser[];
	dailyAssignmentsIsLoading: boolean;
	dailyAssignmentMutation: any;
	modal: any;
}

export default function AssignmentsTab({
	locations,
	dailyAssignments,
	users,
	dailyAssignmentsIsLoading,
	dailyAssignmentMutation,
	modal,
}: AssignmentsTabProps) {
	const { t } = useTranslation();

	// Состояния для управления развернутыми/свернутыми элементами
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});
	const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignmentResponse | null>();

	// Функции для обработки состояния развернутых элементов
	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const getUserById = (id: number) => {
		if (!users) return null;
		return users.find(u => u.id === id);
	};

	const renderModals = () => (
		<>
			{modal.modals.createAssignment && (
				<ModalContainer
					visible={modal.modals.createAssignment}
					onClose={() => modal.closeModal("createAssignment")}
				>
					<CreateDailyAssignmentForm
						onSubmit={dailyAssignmentMutation.handleCreateDailyAssignment}
						onClose={() => modal.closeModal("createAssignment")}
						users={users || []}
						locations={locations}
						isLoading={dailyAssignmentMutation.createDailyAssignmentMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.editAssignment && !!selectedAssignment && (
				<ModalContainer
					visible={modal.modals.editAssignment}
					onClose={() => modal.closeModal("editAssignment")}
				>
					<EditDailyAssignmentForm
						assignment={selectedAssignment}
						onSubmit={dailyAssignmentMutation.handleUpdateDailyAssignment}
						onClose={() => modal.closeModal("editAssignment")}
						users={users || []}
						locations={locations}
						isLoading={dailyAssignmentMutation.updateDailyAssignmentMutation.isPending}
					/>
				</ModalContainer>
			)}

			{modal.modals.deleteAssignment && !!selectedAssignment && (
				<ModalContainer
					visible={modal.modals.deleteAssignment}
					onClose={() => modal.closeModal("deleteAssignment")}
				>
					<DeleteDailyAssignmentConfirm
						assignment={selectedAssignment}
						onConfirm={dailyAssignmentMutation.handleDeleteDailyAssignment}
						onClose={() => modal.closeModal("deleteAssignment")}
						isLoading={dailyAssignmentMutation.deleteDailyAssignmentMutation.isPending}
					/>
				</ModalContainer>
			)}
		</>
	);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.headerContainer}>
					<Button variant="contained" onPress={() => modal.openModal("createAssignment")}>
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
											{location.name} - {formatToDateTime(assignment.date)}
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
									<Typography variant="subtitle2">
										{t("admin.assignmentDetails")}
									</Typography>
									<Typography>
										{t("admin.date")}: {formatToDateTime(assignment.date)}
									</Typography>
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
					})}
			</ScrollView>

			{renderModals()}
		</View>
	);
}
const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},

	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
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

	iconColor: {
		color: theme.colors.primary.text,
	},
}));
