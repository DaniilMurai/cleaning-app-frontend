import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

interface Props {
	isVisible?: boolean;
	assignedDates: DateType[];
	onConfirm?: (date: Date) => void;
	// onCancel?: () => void;
}

export default function Calendar({ isVisible, assignedDates, onConfirm }: Props) {
	const { theme } = useUnistyles();

	const [selectedDate, setSelectedDate] = useState<DateType>();

	if (isVisible && !isVisible) {
		return null;
	}

	const handleConfirm = (date: DateType) => {
		setSelectedDate(dayjs(date as Date));

		if (onConfirm) {
			onConfirm(date as Date);
		}
	};

	return (
		<View style={styles.modalOverlay}>
			<View style={styles.pickerContainer}>
				<DateTimePicker
					mode={"multiple"}
					styles={{
						header: {
							backgroundColor: theme.colors.primary.light,
						},
						day: {
							color: theme.colors.text.primary,
						},
						today: {
							// backgroundColor: theme.colors.primary.main,
							borderColor: theme.colors.primary.main,
							borderWidth: 1,
							borderRadius: theme.borderRadius(10),
						},
						time_label: { color: theme.colors.text.primary },
						day_label: {
							color: theme.colors.text.primary,
						},
						button_prev_image: { tintColor: theme.colors.primary.text },
						button_next_image: { tintColor: theme.colors.primary.text },
						weekday_label: { color: theme.colors.text.primary },
						selected: {
							backgroundColor: theme.colors.primary.main,
							borderRadius: theme.borderRadius(10),
							color: theme.colors.primary.text,
						},
						selected_label: {
							color: theme.colors.primary.text,
						},
					}}
					dates={assignedDates}
					date={selectedDate}
					onChange={({ datePressed }) => handleConfirm(datePressed)}
					// onChange={({ dates}) => {
					// 	// DateType может быть Date | string | dayjs, но safe to wrap через dayjs()
					// 	setSelectedDate(dayjs(dates as Date));
					// }}
				/>

				{/*<View style={styles.buttonRow}>*/}
				{/*	<Button variant="text" onPress={onCancel}>*/}
				{/*		{t("common.cancel")}*/}
				{/*	</Button>*/}
				{/*</View>*/}
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: {
			xs: theme.spacing(9),
			sm: theme.spacing(9),
			md: theme.spacing(2),
		},
	},
	pickerContainer: {
		borderRadius: theme.spacing(1.5),
		width: "90%",
		minWidth: 300,
		backgroundColor: theme.colors.background.default,
		overflow: "hidden",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		padding: theme.spacing(2),
	},
	pickerNumbers: {
		color: theme.colors.text.primary,
	},
	buttonPrevNext: {
		backgroundColor: theme.colors.primary.main,
	},
}));
