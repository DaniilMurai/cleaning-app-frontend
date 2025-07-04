import { GetReportsParams } from "@/api/admin";
import { StyleSheet } from "react-native-unistyles";
import { Button, Input, Picker, Typography } from "@/ui";
import { PickerOption } from "@/ui/common/Picker";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useTranslation } from "react-i18next";
import ExportReportsPanel from "@/components/reports/ExportReportsPanel";

interface props {
	params: GetReportsParams;
	onAction: (params: GetReportsParams) => any;
	isVisible?: boolean;
	onChangeVisible: (isVisible: boolean) => void;
}

//TODO status и search не работают из за бэкэнда
export default function SearchFilterPanel({ params, onAction, isVisible, onChangeVisible }: props) {
	const [status, setStatus] = useState<string | null>(null);
	const [search, setSearch] = useState<string>(params.search ?? "");

	const { t } = useTranslation();
	const [isVisibleExportReports, setIsVisibleExportReports] = useState(false);

	const debouncedSearch = useDebounce(search, 300);

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
					<Button variant={"text"} onPress={handleClear}>
						{t("components.searchFilterPanel.clearAll")}
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
						label={t("components.searchFilterPanel.search")}
						size={"large"}
						placeholder={t("components.searchFilterPanel.searchPlaceholder")}
						style={styles.input}
						value={search}
						icon={
							<FontAwesome5
								name={"search"}
								size={16}
								color={styles.iconColor.color}
							/>
						}
						onChangeText={setSearch}
					/>
				</View>
				<View style={styles.pickersContainer}>
					<View style={styles.pickerContainer}>
						<Picker
							placeholder={t("components.searchFilterPanel.allStatuses")}
							style={styles.picker}
							label={t("components.searchFilterPanel.status")}
							options={statusOptions}
							value={status ?? ""}
							onChange={setStatus}
						/>
					</View>

					<View style={styles.pickerContainer}>
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
					</View>
					<View style={styles.pickerContainer}>
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
					<View style={{ alignSelf: "flex-end", marginBottom: 8 }}>
						<ExportReportsPanel
							isVisible={isVisibleExportReports}
							onClose={() => setIsVisibleExportReports(false)}
						/>
						<Button
							variant={"outlined"}
							onPress={() => setIsVisibleExportReports(true)}
						>
							Generate Export
						</Button>
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
