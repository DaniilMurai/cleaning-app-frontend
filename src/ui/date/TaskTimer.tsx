// src/ui/components/user/TaskTimer.tsx

import React, { useEffect, useState } from "react";
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
		endTime: number | null
		// initialElapsedTime?: number | null,
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

	console.log("initialElapsedTime: " + initialElapsedTime);
	const [status, setStatus] = useState<AssignmentStatus>(initialStatus);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [endTime, setEndTime] = useState<number | null>(null);
	const [totalElapsedTime, setTotalElapsedTime] = useState<number>(initialElapsedTime);
	console.log("totalElapsedTime: " + totalElapsedTime);
	const [displayTime, setDisplayTime] = useState<string>("00:00:00");
	const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
	const [isTimePickerVisible, setTimePickerVisible] = useState(false);

	const showTimePicker = () => setTimePickerVisible(true);
	const hideTimePicker = () => setTimePickerVisible(false);

	// Обработка выбора времени
	const handleTimeConfirm = (selectedDate: Date) => {
		hideTimePicker();
		const now = new Date();
		console.log("selected date: " + selectedDate);
		const differenceMs = now.getTime() - selectedDate.getTime();

		if (differenceMs < 0) {
			// Обработка выбора будущего времени
			alert("Нельзя выбрать будущее время");
			return;
		}

		setStartTime(selectedDate.getTime());
		setTotalElapsedTime(differenceMs);
		console.log("totalElapsedTime in handleTimeConfirm " + totalElapsedTime);
		startTaskWithOffset(selectedDate.getTime(), differenceMs);
	};

	// Запуск задачи с учетом смещения времени
	const startTaskWithOffset = (startTimestamp: number, initialElapsed: number) => {
		setStartTime(startTimestamp);
		setTotalElapsedTime(initialElapsed);
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		setStatus(AssignmentStatus.in_progress);

		const intervalId = setInterval(() => {
			setTotalElapsedTime(prev => prev + 1000);
		}, 1000);
		console.log("totalElapsedTime in startTaskWithOffset " + totalElapsedTime);

		setTimerInterval(intervalId as unknown as ReturnType<typeof setInterval>);

		if (onStatusChange) {
			onStatusChange(AssignmentStatus.in_progress, initialElapsed, startTimestamp, endTime);
		}
	};

	useEffect(() => {
		if (startTimeBackend && status === AssignmentStatus.in_progress) {
			const date = new Date(startTimeBackend);
			const now = new Date();
			console.log("useEffect status in progress");
			setTotalElapsedTime(now.getTime() - date.getTime());
			console.log("totalElapsedTime in useEffect 1 " + totalElapsedTime);

			const intervalId = setInterval(() => {
				setTotalElapsedTime(prev => prev + 1000);
			}, 1000);
			console.log("totalElapsedTime In useEffect 2 " + totalElapsedTime);

			setTimerInterval(intervalId as unknown as ReturnType<typeof setInterval>);

			console.log("totalElapsedTime In useEffect 3 " + totalElapsedTime);
		}
	}, [status]);

	// Обновление отображаемого времени
	useEffect(() => {
		setDisplayTime(formatTime(totalElapsedTime));
		console.log("totalElapsedTime in display time useEffect " + totalElapsedTime);
	}, [totalElapsedTime]);

	// Очистка интервала при размонтировании компонента
	useEffect(() => {
		return () => {
			if (timerInterval) {
				clearInterval(timerInterval);
			}
		};
	}, [timerInterval]);

	// Запустить задачу
	const startTask = () => {
		const now = Date.now();

		// Остановить любые существующие интервалы
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		setStatus(AssignmentStatus.in_progress);
		setStartTime(now);

		// Устанавливаем интервал для обновления таймера
		const intervalId = setInterval(() => {
			setTotalElapsedTime(prev => {
				// Увеличиваем на 1 секунду
				return prev + 1000;
			});
		}, 1000);
		console.log("totalElapsedTime in startTask" + totalElapsedTime);

		setTimerInterval(intervalId as unknown as ReturnType<typeof setInterval>);

		// Вызываем колбэк, если он предоставлен
		if (onStatusChange) {
			onStatusChange(AssignmentStatus.in_progress, totalElapsedTime, now, endTime);
		}
	};

	const cancelTask = () => {
		if (status !== AssignmentStatus.in_progress) return;

		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
		setStatus(AssignmentStatus.not_started);
		setStartTime(null);
		setTotalElapsedTime(0);
		console.log("totalElapsedTime in canselTask" + totalElapsedTime);
		setDisplayTime("00:00:00");
		if (onStatusChange) {
			onStatusChange(AssignmentStatus.not_started, 0, null, null);
		}
	};

	// Завершить задачу
	const completeTask = () => {
		// Остановить интервал
		const now = Date.now();
		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
		setEndTime(now);
		setStatus(AssignmentStatus.completed);

		// Вызываем колбэк, если он предоставлен
		if (onStatusChange) {
			onStatusChange(AssignmentStatus.completed, totalElapsedTime, startTime, now);
		}
	};

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
							<FontAwesome5 name="play" size={14} color={styles.iconColor} />
						</Button>

						<Button
							variant="outlined"
							onPress={showTimePicker}
							style={[styles.commonButton, styles.otherTimeButton]}
						>
							<FontAwesome5 name="clock" size={14} color={styles.iconColor} />
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
							<FontAwesome5 name="ban" size={14} color={styles.iconColor} />
						</Button>

						<Button
							variant="contained"
							onPress={completeTask}
							style={[styles.commonButton, styles.completeButton]}
						>
							<FontAwesome5 name="check" size={14} color={styles.iconColor} />
						</Button>
					</>
				)}

				{status === AssignmentStatus.completed && (
					<Typography variant="subtitle1" style={styles.completedText}>
						{t("components.taskTimer.completed")}
					</Typography>
				)}

				{/* Модальное окно выбора времени */}
				<DateInputModal
					isVisible={isTimePickerVisible}
					mode="time"
					onConfirm={selectedTime => {
						handleTimeConfirm(selectedTime);
						console.log(selectedTime);
					}}
					onCancel={hideTimePicker}
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
	commonButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: theme.spacing(2),
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
}));
