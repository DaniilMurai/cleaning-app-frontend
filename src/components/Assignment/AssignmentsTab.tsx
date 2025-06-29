// src/ui/components/admin/AssignmentsTab.tsx
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Dialog, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { AdminReadUser, DailyAssignmentResponse, LocationResponse } from "@/api/admin";
import {
	CreateDailyAssignmentForm,
	DeleteDailyAssignmentConfirm,
	EditDailyAssignmentForm,
} from "@/ui/forms/common/DailyAssignmentForms";
import Calendar from "@/components/user/calendar/Calendar";
import RenderDailyAssignments from "@/components/Assignment/RenderDailyAssignments";
import { useLanguage } from "@/core/context/LanguageContext";
import { useTranslation } from "react-i18next";

interface AssignmentsTabProps {
	locations: LocationResponse[];
	dailyAssignments: DailyAssignmentResponse[];
	users?: AdminReadUser[];
	dailyAssignmentMutation: any;
	modal: any;
}

export default function AssignmentsTab({
	locations,
	dailyAssignments,
	users,
	dailyAssignmentMutation,
	modal,
}: AssignmentsTabProps) {
	const { currentLanguage } = useLanguage();

	const { t } = useTranslation();

	// Состояния для управления развернутыми/свернутыми элементами
	const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignmentResponse | null>();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const renderModals = () => (
		<>
			{modal.modals.createAssignment && (
				<Dialog
					visible={modal.modals.createAssignment}
					onClose={() => modal.closeModal("createAssignment")}
				>
					<CreateDailyAssignmentForm
						onSubmit={dailyAssignmentMutation.handleCreateDailyAssignmentsBatch}
						onClose={() => modal.closeModal("createAssignment")}
						users={users || []}
						locations={locations}
						isLoading={dailyAssignmentMutation.createDailyAssignmentMutation.isPending}
					/>
				</Dialog>
			)}

			{modal.modals.editAssignment && !!selectedAssignment && (
				<Dialog
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
				</Dialog>
			)}

			{modal.modals.deleteAssignment && !!selectedAssignment && (
				<Dialog
					visible={modal.modals.deleteAssignment}
					onClose={() => modal.closeModal("deleteAssignment")}
				>
					<DeleteDailyAssignmentConfirm
						assignment={selectedAssignment}
						onConfirm={dailyAssignmentMutation.handleDeleteDailyAssignment}
						onClose={() => modal.closeModal("deleteAssignment")}
						isLoading={dailyAssignmentMutation.deleteDailyAssignmentMutation.isPending}
					/>
				</Dialog>
			)}
		</>
	);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContentContainer}
			>
				<View style={styles.page}>
					{/* Календарь слева */}
					<View style={styles.sidebar}>
						<Calendar
							assignedDates={dailyAssignments.map(assignment => assignment.date)}
							onConfirm={date => setSelectedDate(date)}
						/>
					</View>

					{/* Задачи справа */}
					<View style={styles.tasksContainer}>
						<View style={styles.dateTaskContainer}>
							<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
								<Typography variant={"h5"}>{t("admin.tasks")}</Typography>
								<Button
									variant="contained"
									onPress={() => modal.openModal("createAssignment")}
								>
									<FontAwesome5
										name="plus"
										size={16}
										color={styles.iconColor.color}
									/>
								</Button>
							</View>
							<Typography variant={"body1"} color={styles.dateText.color}>
								{selectedDate
									.toLocaleDateString(currentLanguage, {
										weekday: "long",
										day: "numeric",
										month: "long",
									})
									.replace(/^./, str => str.toUpperCase())}
							</Typography>
						</View>
						<RenderDailyAssignments
							dailyAssignments={dailyAssignments}
							setSelectedAssignment={setSelectedAssignment}
							selectedDate={selectedDate}
							modal={modal}
							users={users}
							locations={locations}
						/>
					</View>
				</View>
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
	renderDailyAssignmentContainer: {},

	scrollContainer: {
		flex: 1,
		padding: theme.spacing(2),
	},
	page: {
		flex: 1,
		flexDirection: {
			xs: "column",
			sm: "column",
			md: "row",
		},
		gap: { xs: theme.spacing(3), sm: theme.spacing(0), md: theme.spacing(6) },
	},
	sidebar: {
		flex: { sm: 1, md: 0.5 },
		alignSelf: "flex-start",
		alignContent: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	tasksContainer: {
		flex: 1,
		marginHorizontal: { xs: 0, md: theme.spacing(2) },
	},
	scrollContentContainer: {
		paddingVertical: theme.spacing(2),
	},
	headerContainer: {
		flexDirection: "row-reverse",
		margin: theme.spacing(2),
		marginBottom: 0,
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
	dateText: {
		color: theme.colors.text.disabled,
	},
	dateTaskContainer: {
		marginBottom: theme.spacing(2),
	},
}));
