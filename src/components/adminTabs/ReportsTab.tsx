import { View } from "react-native";
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
		order_by: "id",
		direction: "desc",
	});
	// const [isVisibleExportReports, setIsVisibleExportReports] = useState(false);
	const [isVisibleFilterPanel, setIsVisibleFilterPanel] = useState(true);
	// const [show, setShow] = useState(false);
	// Обновляем параметры запроса
	const handleSearch = (newParams: Partial<GetReportsParams>) => {
		setQueryParams(prev => ({
			...prev,
			...newParams,
		}));
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				{!isVisibleFilterPanel && (
					<Button
						variant={"outlined"}
						onPress={() => setIsVisibleFilterPanel(!isVisibleFilterPanel)}
						style={{ marginStart: "auto" }}
					>
						{t("components.searchFilterPanel.showFilterPanel")}
					</Button>
				)}
				<SearchFilterPanel
					isVisible={isVisibleFilterPanel}
					params={queryParams}
					onAction={handleSearch}
					onChangeVisible={isVisible => setIsVisibleFilterPanel(isVisible)}
				/>
			</View>
			{/*<Toast show={show}>*/}
			{/*	<Typography>oooooooo qqqqq aalk asda alaa</Typography>*/}
			{/*</Toast>*/}
			{/*<Button onPress={() => setShow(prev => !prev)}>show</Button>*/}
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
		// flexDirection: "column",
		flexDirection: "row",
		// justifyContent: "center",
		alignItems: "center",
		marginBottom: theme.spacing(2),
		zIndex: 10,
		// gap: theme.spacing(2),
	},
	buttonContainer: {
		flexDirection: "row-reverse",
		marginBottom: theme.spacing(1),
	},
}));
