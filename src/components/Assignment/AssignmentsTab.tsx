// src/ui/components/admin/AssignmentsTab.tsx
import React, { useState } from "react";
import { DimensionValue, ScrollView, useWindowDimensions, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, ModalContainer } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { AdminReadUser, DailyAssignmentResponse, LocationResponse } from "@/api/admin";
import {
	CreateDailyAssignmentForm,
	DeleteDailyAssignmentConfirm,
	EditDailyAssignmentForm,
} from "@/ui/forms/common/DailyAssignmentForms";
import Calendar from "@/components/user/calendar/Calendar";
import RenderDailyAssignments from "@/components/Assignment/RenderDailyAssignments";

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
	const { width } = useWindowDimensions();
	const columns = width > 1200 ? 3 : width > 850 ? 2 : 1;
	const cardWidth: DimensionValue = `${100 / columns - 3}%`; // небольшой отступ
	const [manyColumns, setManyColumns] = useState<boolean>(false);

	// Состояния для управления развернутыми/свернутыми элементами
	const [selectedAssignment, setSelectedAssignment] = useState<DailyAssignmentResponse | null>();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
			<View style={styles.headerContainer}>
				<Button variant="contained" onPress={() => modal.openModal("createAssignment")}>
					<FontAwesome5 name="plus" size={16} color={styles.iconColor.color} />
				</Button>
				<Button
					variant={"outlined"}
					style={{ marginHorizontal: 10 }}
					onPress={() => setManyColumns(!manyColumns)}
				>
					<FontAwesome5 name={manyColumns ? "list" : "th"} size={16} />
				</Button>
			</View>

			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContentContainer}
			>
				<View>
					<Calendar
						assignedDates={dailyAssignments.map(assignment => assignment.date)}
						onConfirm={date => setSelectedDate(date)}
					/>
				</View>
				<View style={styles.renderDailyAssignmentContainer}>
					<RenderDailyAssignments
						dailyAssignments={dailyAssignments}
						setSelectedAssignment={setSelectedAssignment}
						selectedDate={selectedDate}
						modal={modal}
						users={users}
						cardWidth={cardWidth}
						locations={locations}
						manyColumns={manyColumns}
					/>
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
	scrollContentContainer: {
		flexDirection: {
			xs: "column",
			sm: "column",
			md: "row",
		},
		gap: { sm: theme.spacing(0), md: theme.spacing(6) },
	},

	headerContainer: {
		flexDirection: "row-reverse",
		margin: theme.spacing(2),
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
