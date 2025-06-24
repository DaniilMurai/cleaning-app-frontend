// src/ui/components/user/TaskTimer.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import DateInputModal from "@/ui/date/DateInputModal";
import { AssignmentStatus } from "@/api/client";
import { formatTime } from "@/core/utils/dateUtils";

interface TaskTimerProps {
	onStatusChange?: (
		status: AssignmentStatus,
		totalTime: number,
		startTime: number | null,
		endTime: number | null,
		attemptComplete?: boolean
	) => void;
	initialStatus?: AssignmentStatus;
	initialElapsedTime?: number;
	alreadyDoneTime?: number;
	startTimeBackend?: string | null;
}

export default function TaskTimer({
	onStatusChange,
	initialStatus = AssignmentStatus.not_started,
	initialElapsedTime = 0,
	alreadyDoneTime,
	startTimeBackend,
}: TaskTimerProps) {
	const { t } = useTranslation();
	const [status, setStatus] = useState(initialStatus);
	const [displayTime, setDisplayTime] = useState("00:00:00");
	const [isTimePickerVisible, setTimePickerVisible] = useState(false);

	const intervalRef = useRef<number | null>(null);
	const startRef = useRef<number | null>(
		startTimeBackend ? new Date(startTimeBackend).getTime() : null
	);
	const elapsedRef = useRef<number>(
		startTimeBackend && initialStatus === AssignmentStatus.in_progress
			? Date.now() - (startRef.current as number)
			: initialElapsedTime * 1000
	);

	const clearTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const tick = useCallback(() => {
		if (startRef.current !== null) {
			elapsedRef.current = Date.now() - startRef.current;
			setDisplayTime(formatTime(elapsedRef.current));
		}
	}, []);

	const startInterval = useCallback(() => {
		clearTimer();
		tick();
		intervalRef.current = setInterval(tick, 1000);
	}, [clearTimer, tick]);

	const startTask = () => {
		const now = Date.now();
		startRef.current = now;
		elapsedRef.current = 0;
		setStatus(AssignmentStatus.in_progress);
		startInterval();
		onStatusChange?.(AssignmentStatus.in_progress, elapsedRef.current, startRef.current, null);
	};

	const startWithOffset = (picked: number) => {
		startRef.current = picked;
		elapsedRef.current = Date.now() - picked;
		setStatus(AssignmentStatus.in_progress);
		startInterval();
		onStatusChange?.(AssignmentStatus.in_progress, elapsedRef.current, startRef.current, null);
	};

	const cancelTask = () => {
		if (status !== AssignmentStatus.in_progress) return;
		clearTimer();
		setStatus(AssignmentStatus.not_started);
		onStatusChange?.(AssignmentStatus.not_started, 0, null, null);
		startRef.current = null;
		elapsedRef.current = 0;
		setDisplayTime("00:00:00");
	};

	const attemptComplete = () => {
		// только сигнализируем, не останавливаем таймер
		const endTime = Date.now();
		onStatusChange?.(status, elapsedRef.current, startRef.current, endTime, true);
	};

	const handleTimeConfirm = (selectedDate: Date) => {
		setTimePickerVisible(false);
		const picked = selectedDate.getTime();
		if (picked > Date.now()) {
			alert(t("components.taskTimer.futureTimeError"));
			return;
		}
		startWithOffset(picked);
	};

	// Инициализация при монтировании
	useEffect(() => {
		if (initialStatus === AssignmentStatus.in_progress && startRef.current !== null) {
			setStatus(AssignmentStatus.in_progress);
			startInterval();
		}
		if (
			initialStatus === AssignmentStatus.completed ||
			initialStatus === AssignmentStatus.partially_completed ||
			initialStatus === AssignmentStatus.not_completed
		) {
			clearTimer();
			setStatus(initialStatus);
			setDisplayTime(formatTime(elapsedRef.current));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Реагируем на изменение initialStatus из родителя
	useEffect(() => {
		if (
			(initialStatus === AssignmentStatus.completed ||
				initialStatus === AssignmentStatus.partially_completed ||
				initialStatus === AssignmentStatus.not_completed) &&
			status === AssignmentStatus.in_progress
		) {
			clearTimer();
			setStatus(initialStatus);
			setDisplayTime(formatTime(elapsedRef.current));
		}
		if (
			initialStatus === AssignmentStatus.in_progress &&
			status !== AssignmentStatus.in_progress &&
			startRef.current !== null
		) {
			setStatus(AssignmentStatus.in_progress);
			startInterval();
		}
	}, [initialStatus, status, startInterval, clearTimer]);

	useEffect(() => clearTimer, [clearTimer]);

	return (
		<View style={styles.timerContainer}>
			<Typography variant="h6" style={styles.timerText}>
				{t("components.taskTimer.time")}:{" "}
				{alreadyDoneTime ? formatTime(alreadyDoneTime * 1000) : displayTime}
			</Typography>

			<View style={styles.timerButtons}>
				{status === AssignmentStatus.not_started && (
					<>
						<Button
							variant="contained"
							onPress={startTask}
							style={[styles.commonButton, styles.startButton]}
						>
							<FontAwesome5 name="play" size={14} />
						</Button>
						<Button
							variant="outlined"
							onPress={() => setTimePickerVisible(true)}
							style={[styles.commonButton, styles.otherTimeButton]}
						>
							<FontAwesome5 name="clock" size={14} />
						</Button>
					</>
				)}

				{status === AssignmentStatus.in_progress && (
					<>
						<Button
							variant="outlined"
							onPress={cancelTask}
							style={[styles.commonButton, styles.cancelButton]}
						>
							<FontAwesome5 name="ban" size={14} />
						</Button>
						<Button
							variant="contained"
							onPress={attemptComplete}
							style={[styles.commonButton, styles.completeButton]}
						>
							<FontAwesome5 name="check" size={14} />
						</Button>
					</>
				)}

				{(status === AssignmentStatus.completed ||
					status === AssignmentStatus.partially_completed ||
					status === AssignmentStatus.not_completed) && (
					<Typography
						variant="subtitle1"
						style={
							status === AssignmentStatus.completed
								? styles.completedText
								: status === AssignmentStatus.partially_completed
									? styles.partiallyCompletedText
									: styles.notCompletedText
						}
					>
						{t(
							status === AssignmentStatus.completed
								? "components.taskTimer.completed"
								: status === AssignmentStatus.partially_completed
									? "components.status.partially_completed"
									: "components.status.not_completed"
						)}
					</Typography>
				)}

				<DateInputModal
					isVisible={isTimePickerVisible}
					mode="time"
					onConfirm={handleTimeConfirm}
					onCancel={() => setTimePickerVisible(false)}
					maximumDate={new Date()}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	timerContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: theme.spacing(2),
		padding: theme.spacing(2),
		backgroundColor: theme.colors.background.paper,
		borderRadius: theme.borderRadius(2),
		gap: theme.spacing(2),
		borderWidth: 1,
		maxWidth: 320,
		flexWrap: "wrap",
		borderColor: theme.colors.divider,
	},
	timerText: {
		marginBottom: theme.spacing(1),
		fontWeight: "bold",
	},
	timerButtons: {
		flexDirection: "row",
		gap: theme.spacing(2),
		flexWrap: "wrap",
	},
	buttonText: {
		color: theme.colors.text.primary,
		marginLeft: theme.spacing(1),
	},
	startButton: {
		backgroundColor: theme.colors.primary.main,

		color: theme.colors.text.primary,
	},
	otherTimeButton: {},
	cancelButton: {
		borderColor: theme.colors.error.main,
		color: theme.colors.text.primary,
	},
	resumeButton: {
		backgroundColor: theme.colors.primary.main,
	},
	completeButton: {
		backgroundColor: theme.colors.success.main,
	},
	completedText: {
		color: theme.colors.success.main,
		fontWeight: "bold",
	},
	partiallyCompletedText: {
		color: theme.colors.warning.main,
		fontWeight: "bold",
	},
	notCompletedText: {
		color: theme.colors.error.main,
		fontWeight: "bold",
	},
	commonButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing(2),
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
}));
