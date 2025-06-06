import { ScrollView, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { useState } from "react";
import { Card, ModalContainer, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import Collapse from "@/ui/common/Collapse";
import { useTranslation } from "react-i18next";
import TaskTimer from "@/ui/components/date/TaskTimer";
import ReportForm from "@/ui/forms/common/ReportForm";
import {
	AssignmentStatus,
	CreateReport,
	DailyAssignmentForUserResponse,
	UpdateReport,
	useCreateReport,
	useGetDailyAssignment,
	useUpdateReport,
} from "@/api/client";
import { formatToDateTime } from "@/core/utils/dateUtils";
import useAuth from "@/core/context/AuthContext";

/**
 * Component for displaying daily assignments
 */
export default function DailyAssignmentsList() {
	const { t } = useTranslation();
	const {
		data: dailyAssignments,
		isLoading: dailyAssignmentIsLoading,
		refetch: dailyAssignmentRefetch,
	} = useGetDailyAssignment();

	const createReportMutation = useCreateReport();
	const updateReportMutation = useUpdateReport();
	const [reportId, setReportId] = useState<number | null>(null);
	const [status, setStatus] = useState<AssignmentStatus>("not_started");

	const { user } = useAuth();
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	// State for managing expanded/collapsed elements
	const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({});
	const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

	const [showReport, setShowReport] = useState(false);

	// Functions for handling expanded state
	const toggleAssignment = (id: number) => {
		setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));
	};

	const toggleRoom = (locationId: number, roomId: number) => {
		const key = `${locationId}-${roomId}`;
		setExpandedRooms(prev => ({ ...prev, [key]: !prev[key] }));
	};

	/**
	 * Finds tasks assigned to a specific room within an assignment
	 */
	const getRoomTasks = (assignment: DailyAssignmentForUserResponse, roomId: number) => {
		if (!assignment.room_tasks || !assignment.tasks) {
			return [];
		}

		// Find all task IDs associated with this room
		const roomTaskIds = assignment.room_tasks
			.filter(roomTask => roomTask.room_id === roomId)
			.map(roomTask => roomTask.task_id);

		// Return the tasks that match those IDs
		return assignment.tasks.filter(task => roomTaskIds.includes(task.id));
	};

	/**
	 * Finds room task relationship by room and task IDs
	 */
	const getRoomTaskRelationship = (
		assignment: DailyAssignmentForUserResponse,
		roomId: number,
		taskId: number
	) => {
		return assignment.room_tasks?.find(rt => rt.room_id === roomId && rt.task_id === taskId);
	};

	/**
	 * Renders the empty state message when no rooms are available
	 */
	const renderEmptyRoomsMessage = () => (
		<Typography style={styles.emptyState}>{t("admin.noRooms")}</Typography>
	);

	/**
	 * Renders a task item within a room
	 */
	const renderTaskItem = (
		assignment: DailyAssignmentForUserResponse,
		roomId: number,
		task: any
	) => (
		<View key={task.id} style={styles.roomTaskItem}>
			<Typography style={styles.wrappableText}>{task.title}</Typography>
		</View>
	);

	/**
	 * Renders a room section with its tasks
	 */
	const renderRoomSection = (assignment: DailyAssignmentForUserResponse, room: any) => {
		const roomKey = `${assignment.location.id}-${room.id}`;
		const isRoomExpanded = expandedRooms[roomKey];
		const roomTasks = getRoomTasks(assignment, room.id);

		return (
			<View key={room.id} style={styles.roomSection}>
				<TouchableOpacity
					style={styles.roomHeader}
					onPress={() => toggleRoom(assignment.location.id, room.id)}
				>
					<View style={styles.headerWithIcon}>
						<FontAwesome5
							name={isRoomExpanded ? "angle-down" : "angle-right"}
							size={14}
							color={styles.collapseIcon.color}
						/>
						<Typography style={styles.wrappableText}>{room.name}</Typography>
					</View>
				</TouchableOpacity>
				<Collapse expanded={isRoomExpanded}>
					<View style={styles.roomTasks}>
						<Typography variant="subtitle2" style={styles.wrappableText}>
							{t("admin.tasks")}
						</Typography>
						{roomTasks.length > 0 ? (
							roomTasks.map(task => renderTaskItem(assignment, room.id, task))
						) : (
							<Typography style={[styles.emptyState, styles.wrappableText]}>
								{t("admin.noTasks")}
							</Typography>
						)}
					</View>
				</Collapse>
			</View>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={styles.scrollContainer}>
				{dailyAssignments &&
					dailyAssignments.map(assignment => (
						<Card key={assignment.id} style={styles.card}>
							<TouchableOpacity
								style={styles.cardHeader}
								onPress={() => toggleAssignment(assignment.id)}
							>
								<View style={styles.wrappableText}>
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
										<Typography
											variant="h5"
											style={styles.wrappableText}
											numberOfLines={0}
										>
											{assignment.location.name} -{" "}
											{formatToDateTime(assignment.date)}
										</Typography>
									</View>
									<Typography
										variant="body1"
										style={styles.wrappableText}
										numberOfLines={0}
									>
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
							<Collapse expanded={expandedAssignments[assignment.id]}>
								<TaskTimer
									onStatusChange={async (
										status,
										totalTime,
										startTime,
										endTime
									) => {
										console.log(
											`Assignment ${assignment.id} status changed to ${status}. Total time: ${totalTime}ms`
										);

										if (status) {
											console.log("user: ", user);
											console.log("start time: ", startTime);
											console.log("endTime: ", endTime);
											if (user?.id) {
												if (!reportId) {
													const payload: CreateReport = {
														daily_assignment_id: assignment.id,
														user_id: user.id,
														status: status,
													};

													if (startTime != null) {
														payload.start_time = startTime.toString();
													}
													if (endTime != null) {
														payload.end_time = endTime.toString();
													}

													const report =
														await createReportMutation.mutateAsync({
															data: payload,
														});
													setReportId(report.id);
												} else {
													const payload: UpdateReport = {
														daily_assignment_id: assignment.id,
														user_id: user.id,
														status: status, //TODO может быть partially_complited
													};

													if (startTime != null) {
														payload.start_time = startTime.toString();
													}
													if (endTime != null) {
														payload.end_time = endTime.toString();
													}

													const report =
														await updateReportMutation.mutateAsync({
															data: payload,
															params: { report_id: reportId },
														});

													if (!report) {
														console.log("error");
													} else {
														console.log(
															"Report successfuly created: ",
															report
														);
													}
												}
											}
											setStartTime(startTime);
											setEndTime(endTime);
										}
										setStatus(status);

										if (
											status === AssignmentStatus.completed ||
											status === AssignmentStatus.partially_completed
										) {
											setShowReport(true);
										}
									}}
								/>
								{/*/!* Компонент отправки отчета *!/ //TODO добавить окно с выбором*/}
								{/*//TODO отправлять отчет или пропустить*/}
								{showReport && (
									<ModalContainer
										visible={showReport}
										onClose={() => setShowReport(false)}
									>
										<ReportForm
											onCancel={() => setShowReport(false)}
											taskId={assignment.id}
											onSubmit={async data => {
												// Здесь будет логика отправки отчета на сервер
												console.log("Отправка отчета:", data);

												if (user && startTime && endTime && reportId) {
													const response =
														await updateReportMutation.mutateAsync({
															params: { report_id: reportId },
															data: {
																daily_assignment_id: assignment.id,
																user_id: user.id,
																message: data?.text,
																media_links: data?.media,
																start_time: startTime.toString(),
																end_time: endTime.toString(),
																status: status, //TODO может быть partially_complited
															},
														});
													if (!response) {
														console.log("error");
													} else {
														console.log(
															"Report successfuly created: ",
															response
														);
													}
												} else {
													console.log(
														"Error occured with report updating. user: " +
															user +
															" startTime: " +
															startTime +
															" endTime: " +
															endTime +
															" reportId: " +
															reportId
													);
												}

												await dailyAssignmentRefetch();
												setShowReport(false);
											}}
										/>
									</ModalContainer>
								)}
								<View style={styles.divider} />
								<Typography variant="subtitle1" style={styles.wrappableText}>
									{t("admin.rooms")}
								</Typography>
								{!assignment.rooms ||
								assignment.rooms.filter(
									room => room.location_id === assignment.location.id
								).length === 0
									? renderEmptyRoomsMessage()
									: assignment.rooms.map(room =>
											renderRoomSection(assignment, room)
										)}
							</Collapse>
						</Card>
					))}
			</ScrollView>
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
	card: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		flexWrap: "wrap",
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
		flexWrap: "wrap", // Allow wrapping of header items
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	actionButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
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

	headerContainer: {
		marginBottom: theme.spacing(2),
		alignItems: "flex-end",
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
	emptyState: {
		fontStyle: "italic",
		color: theme.colors.text.secondary,
		marginVertical: theme.spacing(1),
	},
	iconColor: {
		color: theme.colors.primary.text,
	},
	// New style for wrappable text
	wrappableText: {
		flexShrink: 1,
		flexWrap: "wrap",
		flex: 1,
	},
}));
