// src/ui/components/admin/AssignmentsTab.tsx
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Dialog, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import {
	DailyAssignmentCreate,
	DailyAssignmentResponse,
	DailyAssignmentUpdate,
	DeleteDailyAssignmentParams,
	DeleteDailyAssignmentsGroupParams,
	EditDailyAssignmentParams,
	getGetDailyAssignmentsQueryKey,
	useGetDailyAssignmentsDates,
} from "@/api/admin";
import {
	CreateDailyAssignmentForm,
	DeleteDailyAssignmentConfirm,
	DeleteGroupDailyAssignmentsConfirm,
	EditDailyAssignmentForm,
} from "@/ui/forms/common/DailyAssignmentForms";
import Calendar from "@/components/user/calendar/Calendar";
import RenderDailyAssignments from "@/components/Assignment/RenderDailyAssignments";
import { useLanguage } from "@/core/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import useModals from "@/core/hooks/shared/useModals";
import { useAdminMutations } from "@/core/hooks/mutations/useAdminMutations";

export default function AssignmentsTab() {
	const { currentLanguage } = useLanguage();
	const modal = useModals({
		createAssignment: false,
		editAssignment: false,
		deleteAssignment: false,
		deleteAssignmentGroup: false,
	});

	const { dailyAssignmentMutation } = useAdminMutations({
		modals: modal.modals,
		openModal: modal.openModal as (modalName: string | number) => void,
		closeModal: modal.closeModal as (modalName: string | number) => void,
	});

	const { t } = useTranslation();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const queryClient = useQueryClient();

	// Состояния для управления развернутыми/свернутыми элементами
	const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignmentResponse | null>();

	const { data: assignmentsDates, refetch: refetchAssignmentsDates } =
		useGetDailyAssignmentsDates();

	const invalidateDailyAssignments = async () => {
		const queryKey = getGetDailyAssignmentsQueryKey();
		await queryClient.invalidateQueries({ queryKey, exact: false });
		await refetchAssignmentsDates();
	};

	const deleteDailyAssignmentGroupConfirm = async (
		daily_assignment_id: DeleteDailyAssignmentsGroupParams
	) => {
		await dailyAssignmentMutation.handleDeleteDailyAssignmentGroup(daily_assignment_id);
		await invalidateDailyAssignments();
	};

	const deleteDailyAssignmentConfirm = async (
		daily_assignment_id: DeleteDailyAssignmentParams
	) => {
		await dailyAssignmentMutation.handleDeleteDailyAssignment(daily_assignment_id);
		await invalidateDailyAssignments();
	};
	const deleteSingleDailyAssignmentConfirm = async (
		daily_assignment_id: DeleteDailyAssignmentParams
	) => {
		await dailyAssignmentMutation.handleDeleteSingleDailyAssignmentMutation(
			daily_assignment_id
		);
		await invalidateDailyAssignments();
	};

	const createDailyAssignmentSubmit = async (assignmentData: DailyAssignmentCreate[]) => {
		await dailyAssignmentMutation.handleCreateDailyAssignmentsBatch(assignmentData);
		await invalidateDailyAssignments();
	};

	const editDailyAssignmentSubmit = async (
		assignmentId: EditDailyAssignmentParams,
		assignmentData: DailyAssignmentUpdate
	) => {
		await dailyAssignmentMutation.handleUpdateDailyAssignment(assignmentId, assignmentData);
		await invalidateDailyAssignments();
	};

	const renderModals = () => (
		<>
			{modal.modals.createAssignment && (
				<CreateDailyAssignmentForm
					onSubmit={async assignmentData =>
						await createDailyAssignmentSubmit(assignmentData)
					}
					onClose={() => modal.closeModal("createAssignment")}
					isLoading={dailyAssignmentMutation.createDailyAssignmentMutation.isPending}
					isVisible={modal.modals.createAssignment}
				/>
			)}

			{modal.modals.editAssignment && !!selectedAssignment && (
				<Dialog
					visible={modal.modals.editAssignment}
					onClose={() => modal.closeModal("editAssignment")}
				>
					<EditDailyAssignmentForm
						assignment={selectedAssignment}
						onSubmit={async (assignmentId, assignmentData) =>
							await editDailyAssignmentSubmit(assignmentId, assignmentData)
						}
						isVisible={modal.modals.editAssignment}
						onClose={() => modal.closeModal("editAssignment")}
						isLoading={dailyAssignmentMutation.updateDailyAssignmentMutation.isPending}
					/>
				</Dialog>
			)}
			{modal.modals.deleteAssignmentGroup && !!selectedAssignment && (
				<Dialog
					visible={modal.modals.deleteAssignmentGroup}
					onClose={() => modal.closeModal("deleteAssignmentGroup")}
				>
					<DeleteGroupDailyAssignmentsConfirm
						assignment={selectedAssignment}
						onSingleConfirm={async daily_assignment_id =>
							await deleteSingleDailyAssignmentConfirm(daily_assignment_id)
						}
						onGroupConfirm={async daily_assignment_id =>
							await deleteDailyAssignmentGroupConfirm(daily_assignment_id)
						}
						onClose={() => modal.closeModal("deleteAssignmentGroup")}
						// isLoading={
						// 	dailyAssignmentMutation.handleDeleteDailyAssignmentGroup.isPending
						// }
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
						onConfirm={async daily_assignment_id =>
							await deleteDailyAssignmentConfirm(daily_assignment_id)
						}
						onClose={() => modal.closeModal("deleteAssignment")}
						// isLoading={dailyAssignmentMutation.handleDeleteDailyAssignment.isPending}
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
							assignedDates={assignmentsDates ?? [""]}
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
							selectedDate={selectedDate}
							setSelectedAssignment={setSelectedAssignment}
							modal={modal}
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
