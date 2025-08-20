import { Platform, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui";
import { GetReportsParams } from "@/api/admin";
import ReportsTable from "@/components/reports/ReportTable";
import React, { useState } from "react";
import SearchFilterPanel from "@/components/reports/SearchFilterPanel";
import useExportReportSSE from "@/components/reports/useExportReportSSE";
import { useTranslation } from "react-i18next";

export default function ReportsTab() {
	// Состояние для параметров запроса
	const { t } = useTranslation();
	useExportReportSSE();
	const [queryParams, setQueryParams] = useState<GetReportsParams>({
		search: "",
		status: "no-value",
		order_by: "id",
		direction: "desc",
	});

	const [isVisibleFilterPanel, setIsVisibleFilterPanel] = useState(true);

	const handleSearch = (newParams: Partial<GetReportsParams>) => {
		setQueryParams(prev => ({
			...prev,
			...newParams,
		}));
	};

	return (
		<View style={styles.container}>
			{!isVisibleFilterPanel && (
				<Button
					variant={"outlined"}
					onPress={() => setIsVisibleFilterPanel(!isVisibleFilterPanel)}
					style={{ marginStart: "auto" }}
				>
					{t("components.searchFilterPanel.showFilterPanel")}
				</Button>
			)}
			<View
				style={[
					styles.headerContainer,
					isVisibleFilterPanel && Platform.OS !== "web" && { flex: 4 },
				]}
			>
				<SearchFilterPanel
					isVisible={isVisibleFilterPanel}
					params={queryParams}
					onAction={handleSearch}
					onChangeVisible={isVisible => setIsVisibleFilterPanel(isVisible)}
				/>
			</View>

			<View style={styles.scrollContainer}>
				<ReportsTable queryParams={queryParams} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		flexDirection: "column",
		paddingHorizontal: {
			xs: theme.spacing(2),
			lg: theme.spacing(4),
			xl: theme.spacing(5),
			xxl: theme.spacing(12),
		},
		paddingVertical: theme.spacing(4),
	},
	scrollContainer: {
		flex: 1,
	},
	headerContainer: {
		flexDirection: "row",
		// flex: 1,
		alignItems: "center",
		marginBottom: theme.spacing(2),
		zIndex: 10,
	},
	buttonContainer: {
		flexDirection: "row-reverse",
		marginBottom: theme.spacing(1),
	},
}));
