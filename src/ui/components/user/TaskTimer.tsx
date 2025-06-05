// src/ui/components/user/TaskTimer.tsx

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import CrossPlatformDateTimePicker from "@/ui/components/common/CrossPlatformDateTimePicker";

export enum TaskStatus {
	NOT_STARTED = "NOT_STARTED",
	IN_PROGRESS = "IN_PROGRESS",
	PAUSED = "PAUSED",
	COMPLETED = "COMPLETED",
}

interface TaskTimerProps {
	assignmentId: number;
	onStatusChange?: (status: TaskStatus, totalTime: number) => void;
	initialStatus?: TaskStatus;
	initialElapsedTime?: number;
}

export default function TaskTimer({
	assignmentId,
	onStatusChange,
	initialStatus = TaskStatus.NOT_STARTED,
	initialElapsedTime = 0,
}: TaskTimerProps) {
	const { t } = useTranslation();

	const [status, setStatus] = useState<TaskStatus>(initialStatus);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [customStartTime, setCustomStartTime] = useState<number | null>(null);
	const [pausedTime, setPausedTime] = useState<number | null>(null);
	const [totalElapsedTime, setTotalElapsedTime] = useState<number>(initialElapsedTime);
	const [displayTime, setDisplayTime] = useState<string>("00:00:00");
	const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
	const [isTimePickerVisible, setTimePickerVisible] = useState(false);

	const showTimePicker = () => setTimePickerVisible(true);
	const hideTimePicker = () => setTimePickerVisible(false);

	// Обработка выбора времени
	const handleTimeConfirm = (selectedDate: Date) => {
		hideTimePicker();
		const now = new Date();
		const differenceMs = now.getTime() - selectedDate.getTime();

		if (differenceMs < 0) {
			// Обработка выбора будущего времени
			alert("Нельзя выбрать будущее время");
			return;
		}

		// Устанавливаем прошедшее время
		setTotalElapsedTime(differenceMs);

		// Запускаем таймер с учетом выбранного времени
		startTaskWithOffset(differenceMs);
	};

	// Запуск задачи с учетом смещения времени
	const startTaskWithOffset = (initialTime: number) => {
		// ... аналогично startTask, но с initialTime
		const now = Date.now();

		if (timerInterval) {
			clearInterval(timerInterval);
		}

		setStatus(TaskStatus.IN_PROGRESS);
		setStartTime(now);
		setPausedTime(null);
		setTotalElapsedTime(initialTime);

		const intervalId = setInterval(() => {
			setTotalElapsedTime(prev => prev + 1000);
		}, 1000);

		setTimerInterval(intervalId as unknown as ReturnType<typeof setInterval>);

		if (onStatusChange) {
			onStatusChange(TaskStatus.IN_PROGRESS, initialTime);
		}
	};

	// Форматирование даты для отображения в пикере
	const formatPickerDate = (date: Date) => format(date, "dd.MM.yyyy HH:mm");

	// Функция для форматирования времени
	const formatTime = (timeInMs: number): string => {
		const totalSeconds = Math.floor(timeInMs / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	// Обновление отображаемого времени
	useEffect(() => {
		setDisplayTime(formatTime(totalElapsedTime));
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

		setStatus(TaskStatus.IN_PROGRESS);
		setStartTime(now);
		setPausedTime(null);

		// Устанавливаем интервал для обновления таймера
		const intervalId = setInterval(() => {
			setTotalElapsedTime(prev => {
				const newTotal = prev + 1000; // Увеличиваем на 1 секунду
				return newTotal;
			});
		}, 1000);

		setTimerInterval(intervalId as unknown as ReturnType<typeof setInterval>);

		// Вызываем колбэк, если он предоставлен
		if (onStatusChange) {
			onStatusChange(TaskStatus.IN_PROGRESS, totalElapsedTime);
		}
	};

	const startInOtherTime = () => {
		if (status !== TaskStatus.NOT_STARTED) return;
	};

	const cancelTask = () => {
		if (status !== TaskStatus.IN_PROGRESS) return;

		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
		setStatus(TaskStatus.NOT_STARTED);
		setStartTime(null);
		setTotalElapsedTime(0);
		setDisplayTime("00:00:00");
	};

	// Приостановить задачу
	const pauseTask = () => {
		if (status !== TaskStatus.IN_PROGRESS) return;

		// Остановить интервал
		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}

		setStatus(TaskStatus.PAUSED);
		setPausedTime(Date.now());

		// Вызываем колбэк, если он предоставлен
		if (onStatusChange) {
			onStatusChange(TaskStatus.PAUSED, totalElapsedTime);
		}
	};

	// Завершить задачу
	const completeTask = () => {
		// Остановить интервал
		if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}

		setStatus(TaskStatus.COMPLETED);

		// Вызываем колбэк, если он предоставлен
		if (onStatusChange) {
			onStatusChange(TaskStatus.COMPLETED, totalElapsedTime);
		}
	};

	return (
		<View style={styles.timerContainer}>
			<Typography variant="h6" style={styles.timerText}>
				{t("components.taskTimer.time")}: {displayTime}
			</Typography>

			<View style={styles.timerButtons}>
				{status === TaskStatus.NOT_STARTED && (
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

				{status === TaskStatus.IN_PROGRESS && (
					<>
						{/*<Button variant="outlined" onPress={pauseTask} style={styles.pauseButton}>*/}
						{/*	<FontAwesome5 name="pause" size={14} />{" "}*/}
						{/*	{t("components.taskTimer.pause")}*/}
						{/*</Button>*/}

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

				{/*{status === TaskStatus.PAUSED && (*/}
				{/*	<>*/}
				{/*		<Button variant="contained" onPress={startTask} style={styles.resumeButton}>*/}
				{/*			<FontAwesome5 name="play" size={14} color="#fff" />{" "}*/}
				{/*			{t("components.taskTimer.resume")}*/}
				{/*		</Button>*/}

				{/*		<Button*/}
				{/*			variant="contained"*/}
				{/*			onPress={completeTask}*/}
				{/*			style={styles.completeButton}*/}
				{/*		>*/}
				{/*			<FontAwesome5 name="check" size={14} color="#fff" />{" "}*/}
				{/*			{t("components.taskTimer.complete")}*/}
				{/*		</Button>*/}
				{/*	</>*/}
				{/*)}*/}

				{status === TaskStatus.COMPLETED && (
					<Typography variant="subtitle1" style={styles.completedText}>
						{t("components.taskTimer.completed")}
					</Typography>
				)}

				{/* Модальное окно выбора времени */}
				<CrossPlatformDateTimePicker
					isVisible={isTimePickerVisible}
					type={"time"}
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
