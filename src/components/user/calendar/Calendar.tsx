import React, { useState } from "react";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";

interface Props {
	assignedDates: DateType[];
	onConfirm?: (date: Date) => void;
	// onCancel?: () => void;
}

export default function Calendar({ assignedDates, onConfirm }: Props) {
	const { theme } = useUnistyles();

	const [selectedDate, setSelectedDate] = useState<DateType>();

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
							borderWidth: 2,
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
							maxWidth: "90%",
							maxHeight: "90%",
						},
						selected_label: {
							color: theme.colors.primary.text,
						},
					}}
					dates={[...assignedDates, selectedDate]}
					onChange={({ datePressed }) => handleConfirm(datePressed)}
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
