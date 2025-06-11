import { GetReportsParams } from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { Button, Picker } from "@/ui";
import { PickerOption } from "@/ui/common/Picker";
import { useState } from "react";
import { View } from "react-native";

interface props {
	params: GetReportsParams;
	onAction: (params: GetReportsParams) => any;
}

const orderByOptions: PickerOption[] = [
	{ label: "id", value: "id" },
	{ label: "Full Name", value: "user_id" },
	// {
	// 	label: "Location",
	// 	value: "daily_assignment_id.location_id",
	// },
	// { label: "Date", value: "daily_assignment.date" },
	{ label: "Status", value: "status" },
	{ label: "Start", value: "start_time" },
	{ label: "End", value: "end_time" },
	// { label: "Duration", value: "duration_seconds" },
];

const directionOptions: PickerOption[] = [
	{ label: "desc", value: "desc" },
	{ label: "asc", value: "asc" },
];

export default function SearchFilterPanel({ params, onAction }: props) {
	const [order, setOrder] = useState<string | null>(params.order_by || null);
	const [direction, setDirection] = useState<string | null>(params.direction || null);

	const handleChange = () => {
		// ✅ Создаем новый объект параметров
		const newParams: Partial<GetReportsParams> = {};

		if (order) newParams.order_by = order;
		if (direction) newParams.direction = direction;

		// ✅ Вызываем колбэк с новыми параметрами
		onAction(newParams);
	};

	return (
		<View style={styles.container}>
			<View style={styles.pickerContainer}>
				<Picker
					placeholder={"id"}
					style={{ width: 150 }}
					label={"Order by"}
					options={orderByOptions}
					value={order ?? "id"}
					onChange={setOrder}
				/>
			</View>
			<View style={styles.pickerContainer}>
				<Picker
					style={{ width: 150 }}
					label={"Direction"}
					options={directionOptions}
					value={direction ?? "desc"}
					onChange={setDirection}
				/>
			</View>
			<Button variant={"contained"} style={styles.button} onPress={handleChange}>
				Submit
			</Button>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: theme.colors.background.default,
		padding: theme.spacing(2),
		margin: theme.spacing(2),
		gap: theme.spacing(4),
	},
	pickerContainer: {
		flexWrap: "wrap",
	},
	button: {
		alignSelf: "flex-end",
	},
}));
