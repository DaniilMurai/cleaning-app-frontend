import { GetReportsParams } from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { Button, Input, Picker, Typography } from "@/ui";
import { PickerOption } from "@/ui/common/Picker";
import { useState } from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface props {
	params: GetReportsParams;
	onAction: (params: GetReportsParams) => any;
	isVisible?: boolean;
	onChangeVisible: (isVisible: boolean) => void;
}

const statusOptions: PickerOption[] = [
	{ label: "All Statuses", value: "" },
	{ label: "Completed", value: "completed" },
	{ label: "Not Started", value: "not_started" },
	{ label: "In Progress", value: "in_progress" },
	{ label: "Partially Completed", value: "partially_completed" },
];

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
	{ label: "descending", value: "desc" },
	{ label: "ascending", value: "asc" },
];
//TODO status и search не работают из за бэкэнда
export default function SearchFilterPanel({ params, onAction, isVisible, onChangeVisible }: props) {
	const [status, setStatus] = useState<string | null>(null);
	const [search, setSearch] = useState<string>(params.search ?? "");

	if (!isVisible) {
		return null;
	}

	const newParams: Partial<GetReportsParams> = {};

	const handleClear = () => {
		setSearch("");
		newParams.search = "";
		newParams.order_by = "id";
		newParams.direction = "desc";
		onAction(newParams);
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Typography>
					<FontAwesome5 name="filter" size={20} color={styles.iconColor.color} /> Search &
					Filters
				</Typography>
				<View style={{ flexDirection: "row", gap: 8 }}>
					<Button variant={"text"} onPress={handleClear}>
						Clear All
					</Button>
					<Button
						onPress={() => onChangeVisible(false)}
						variant={"text"}
						color={"secondary"}
					>
						<FontAwesome5 name={"times"} size={20} color={styles.closeIcon.color} />
					</Button>
				</View>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.searchContainer}>
					<Input
						label={"Search"}
						size={"large"}
						placeholder={" Search users or locations..."}
						style={styles.input}
						value={search}
						icon={
							<FontAwesome5
								name={"search"}
								size={16}
								color={styles.iconColor.color}
							/>
						}
						onChangeText={text => {
							setSearch(text);
							newParams.search = text;
							onAction(newParams);
						}}
					/>
				</View>
				<View style={styles.pickersContainer}>
					<View style={styles.pickerContainer}>
						<Picker
							placeholder={"All Statuses"}
							style={styles.picker}
							label={"Status"}
							options={statusOptions}
							value={status ?? "id"}
							onChange={setStatus}
						/>
					</View>

					<View style={styles.pickerContainer}>
						<Picker
							placeholder={"id"}
							style={styles.picker}
							label={"Order by"}
							options={orderByOptions}
							value={params.order_by ?? "id"}
							// onChange={setOrder}
							onChange={value => {
								value ? (newParams.order_by = value) : "id";
								onAction(newParams);
							}}
						/>
					</View>
					<View style={styles.pickerContainer}>
						<Picker
							label={"Direction"}
							style={styles.picker}
							options={directionOptions}
							value={params.direction ?? "desc"}
							// onChange={setDirection}
							onChange={value => {
								value ? (newParams.direction = value) : "desc";
								onAction(newParams);
							}}
						/>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.paper,
		padding: theme.spacing(3),
		borderRadius: theme.spacing(1),
		gap: theme.spacing(4),
	},
	contentContainer: {
		flexDirection: {
			xs: "column",
			md: "row",
		},
		flex: 1,
		flexWrap: "wrap",
		gap: theme.spacing(4),
	},
	pickerContainer: {
		flex: 1,
	},
	button: {
		alignSelf: "flex-end",
	},
	input: {
		backgroundColor: theme.colors.background.main,
	},
	picker: {
		flex: 0.8,
		minWidth: 200,
		width: "100%",
	},
	iconColor: {
		color: theme.colors.text.primary,
	},
	closeIcon: {
		color: theme.colors.error.main,
	},
	headerContainer: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},
	searchContainer: {
		minWidth: 250,
		maxWidth: 400,
		flex: {
			xs: 2,
			md: 1.5,
		},
	},
	pickersContainer: {
		flexDirection: {
			xs: "column",
			md: "row",
		},
		gap: theme.spacing(2),
	},
}));
