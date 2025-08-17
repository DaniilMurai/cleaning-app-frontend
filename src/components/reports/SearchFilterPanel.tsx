import { GetReportsParams } from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { Button, Picker, Typography } from "@/ui";
import { PickerOption } from "@/ui/common/Picker";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import TextField from "@/max_ui/TextField.tsx";

interface props {
	params: GetReportsParams;
	onAction: (params: GetReportsParams) => any;
	isVisible?: boolean;
	onChangeVisible: (isVisible: boolean) => void;
}

export default function SearchFilterPanel({ params, onAction, isVisible, onChangeVisible }: props) {
	const [search, setSearch] = useState<string>(params.search ?? "");

	const { t } = useTranslation();

	const debouncedSearch = useDebounce(search, 300);
	// const [showCreateExport, setShowCreateExport] = useState<boolean>(false);
	useEffect(() => {
		newParams.search = debouncedSearch;
		console.log("render useEffect" + newParams.search);
		onAction(newParams);
	}, [debouncedSearch]);

	if (!isVisible) {
		return null;
	}

	const newParams: Partial<GetReportsParams> = {};

	const handleClear = () => {
		setSearch("");
		newParams.search = "";
		newParams.status = "";
		newParams.order_by = "id";
		newParams.direction = "desc";
		onAction(newParams);
	};

	// Локализованные опции
	const statusOptions: PickerOption[] = [
		{ label: t("components.searchFilterPanel.allStatuses"), value: "" },
		{ label: t("components.status.completed"), value: "completed" },
		{ label: t("components.status.not_started"), value: "not_started" },
		{ label: t("components.status.in_progress"), value: "in_progress" },
		{ label: t("components.status.partially_completed"), value: "partially_completed" },
		{ label: t("components.status.not_completed"), value: "not_completed" },
		{ label: t("components.status.expired"), value: "expired" },
	];

	const orderByOptions: PickerOption[] = [
		{ label: t("components.searchFilterPanel.orderByOptions.id"), value: "id" },
		{ label: t("components.searchFilterPanel.orderByOptions.user_id"), value: "user_id" },
		{ label: t("components.searchFilterPanel.orderByOptions.status"), value: "status" },
		{ label: t("components.searchFilterPanel.orderByOptions.start_time"), value: "start_time" },
		{ label: t("components.searchFilterPanel.orderByOptions.end_time"), value: "end_time" },
	];

	const directionOptions: PickerOption[] = [
		{ label: t("components.searchFilterPanel.descending"), value: "desc" },
		{ label: t("components.searchFilterPanel.ascending"), value: "asc" },
	];

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Typography>
					<FontAwesome5 name="filter" size={20} color={styles.iconColor.color} />
					{t("components.searchFilterPanel.searchAndFilters")}
				</Typography>

				<View style={{ flexDirection: "row", gap: 8 }}>
					<Button
						variant={"contained"}
						color={"black"}
						size={"medium"}
						onPress={handleClear}
					>
						{t("common.reset")}
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
					<TextField
						label={t("components.searchFilterPanel.search")}
						size={"small"}
						value={search}
						onChangeText={setSearch}
					/>
				</View>
				<Picker
					placeholder={t("components.searchFilterPanel.allStatuses")}
					style={styles.picker}
					label={t("components.searchFilterPanel.status")}
					options={statusOptions}
					value={params.status ?? "All statuses"}
					onChange={value => {
						newParams.status = value;
						onAction(newParams);
					}}
				/>

				<Picker
					placeholder={t("components.searchFilterPanel.orderByOptions.id")}
					style={styles.picker}
					label={t("components.searchFilterPanel.orderBy")}
					options={orderByOptions}
					value={params.order_by ?? "id"}
					onChange={value => {
						value ? (newParams.order_by = value) : "id";
						onAction(newParams);
					}}
				/>
				<Picker
					label={t("components.searchFilterPanel.direction")}
					style={styles.picker}
					options={directionOptions}
					value={params.direction ?? "desc"}
					onChange={value => {
						value ? (newParams.direction = value) : "desc";
						onAction(newParams);
					}}
				/>
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
		width: "100%",
	},
	contentContainer: {
		// flexDirection: {
		// 	xs: "column",
		// 	md: "row",
		// },
		flexDirection: "row",
		justifyContent: "center",
		flex: 1,
		flexWrap: "wrap",
		gap: theme.spacing(4),
	},
	pickerContainer: {
		// flex: 1,
	},
	button: {
		alignSelf: "flex-end",
	},
	input: {
		backgroundColor: theme.colors.background.main,
		// _web: {
		// 	":-webkit-autofill": {
		// 		WebkitBoxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		boxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		WebkitTextFillColor: theme.colors.text.primary,
		// 	},
		// 	":-webkit-autofill:hover": {
		// 		WebkitBoxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		boxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		WebkitTextFillColor: theme.colors.text.primary,
		// 	},
		// 	":-webkit-autofill:focus": {
		// 		WebkitBoxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		boxShadow: `0 0 0 1000px ${theme.colors.background.main} inset`,
		// 		WebkitTextFillColor: theme.colors.text.primary,
		// 	},
		// },
	},
	picker: {
		// flex: 0.8,
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
		// flex: 1,
		justifyContent: "space-between",
	},
	searchContainer: {
		minWidth: 250,
		maxWidth: 400,
		justifyContent: "flex-end",
		// flex: {
		// 	xs: 2,
		// 	md: 1.5,
		// },
	},
	pickersContainer: {
		flexDirection: {
			xs: "column",
			md: "row",
		},
		gap: theme.spacing(2),
	},
}));
