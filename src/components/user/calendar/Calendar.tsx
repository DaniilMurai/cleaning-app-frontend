import React, { useState } from "react";
import { Text, View } from "react-native"; // Добавлен Text
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import DateTimePicker, { CalendarComponents, DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

interface Props {
	assignedDates: DateType[];
	onConfirm?: (date: Date) => void;
}

export default function Calendar({ assignedDates, onConfirm }: Props) {
	const { theme } = useUnistyles();

	const [selectedDate, setSelectedDate] = useState<DateType>();
	const [pressedDate, setPressedDate] = useState<DateType>(); // Состояние для нажатого дня

	const handleConfirm = (date: DateType) => {
		setSelectedDate(dayjs(date as Date));
		setPressedDate(date); // Сохраняем нажатую дату

		if (onConfirm) {
			onConfirm(date as Date);
		}
	};

	// Кастомный рендер дня
	const renderDay = (props: { date: DateType }) => {
		const date = props.date;
		const dayjsDate = dayjs(date);
		const today = dayjs(new Date());
		const isPressed = pressedDate && dayjsDate.isSame(pressedDate, "day");
		const isAssigned = assignedDates.some(d => dayjs(d).isSame(dayjsDate, "day"));
		const isToday = dayjsDate.isSame(today, "day");

		let dayStyle = {};
		let textStyle = {};

		if (isPressed) {
			// Стиль для нажатого дня
			if (isAssigned) {
				dayStyle = {
					backgroundColor: theme.colors.primary.main,
					borderColor: theme.colors.text.primary,
				};
				textStyle = { color: theme.colors.primary.text, fontSize: 14 };
			} else {
				dayStyle = {
					borderColor: theme.colors.primary.main,
				};
				textStyle = { color: theme.colors.text.primary, fontSize: 14 };
			}
			dayStyle = {
				borderWidth: 2,

				borderRadius: theme.borderRadius(10),
				...dayStyle,
			};
		} else if (isToday) {
			dayStyle = {
				color: theme.colors.success.main,
				backgroundColor: theme.colors.primary.mainOpacity,
				borderRadius: theme.borderRadius(10),
			};
			textStyle = {
				color: theme.colors.text.primary,
				fontSize: 14,
			};
		} else if (isAssigned) {
			// Стиль для назначенных дней
			dayStyle = {
				backgroundColor: theme.colors.primary.main,
				borderRadius: theme.borderRadius(10),
				color: theme.colors.primary.text,
			};
			textStyle = {
				color: theme.colors.primary.text,
				fontSize: 14,
			};
		} else {
			dayStyle = {
				color: theme.colors.text.primary,
			};
			textStyle = {
				color: theme.colors.text.primary,
				fontSize: 14,
			};
		}

		return (
			<View style={[styles.dayContainer, dayStyle]}>
				<Text style={[styles.dayText, textStyle]}>{dayjsDate.date()}</Text>
			</View>
		);
	};

	// Собираем объект CalendarComponents
	const components: CalendarComponents = {
		Day: renderDay,
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.pickerContainer}>
				<DateTimePicker
					mode="single" // Изменено на одиночный выбор
					components={components} // Передаем кастомный рендер
					styles={{
						header: {
							backgroundColor: theme.colors.primary.light,
						},
						day: {
							color: theme.colors.text.primary,
						},

						time_label: { color: theme.colors.text.primary },
						day_label: {
							color: theme.colors.text.primary,
						},
						button_prev_image: { tintColor: theme.colors.primary.text },
						button_next_image: { tintColor: theme.colors.primary.text },
						weekday_label: { color: theme.colors.text.primary },
						selected_label: {
							color: theme.colors.primary.text,
						},
					}}
					date={selectedDate} // Для одиночного выбора используем date вместо dates
					onChange={({ date }) => handleConfirm(date)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		marginTop: theme.spacing(0),
		marginStart: {
			xs: 0,
			md: theme.spacing(6),
		},
	},
	pickerContainer: {
		borderRadius: theme.spacing(1.5),
		width: "90%",
		backgroundColor: theme.colors.background.default,
		overflow: "hidden",
		maxWidth: {
			md: 400,
			xs: "100%",
		},
		minWidth: {
			xs: "100%",
			sm: "100%",
			md: 300,
		},
		minHeight: { xs: 300, xl: 350 },
		elevation: 3,
		shadowColor: theme.colors.shadow,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	// Стили для кастомного дня
	dayContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: 36,
		height: 36,
	},
	dayText: {
		fontSize: 16,
		fontWeight: "500",
	},
}));
