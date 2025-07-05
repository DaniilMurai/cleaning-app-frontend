import { Button, Card, Typography } from "@/ui";
import { View } from "react-native";
import ExportReportsDialog from "@/components/reports/ExportReportsDialog";
import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { ReportExportResponse, useGetExportReports } from "@/api/admin";
import { LegendList } from "@legendapp/list";

export default function ExportReportsPanel() {
	const [isVisibleExportReports, setIsVisibleExportReports] = useState(false);

	const { data: exportReports, refetch: exportReportsRefetch } = useGetExportReports();

	const renderHeader = () => (
		<View style={[styles.row, styles.header, { height: 48 }]}>
			<Typography style={[styles.cell, { flex: 0.5 }]}>Type</Typography>
			<Typography style={[styles.cell, { flex: 2 }]}>Period</Typography>
			<Typography style={[styles.cell, { flex: 1 }]}>Timezone</Typography>
			<Typography style={[styles.cell, { flex: 0.25 }]}>lang</Typography>
			<Typography style={[styles.cell, { flex: 1 }]}>status</Typography>
			<Typography style={[styles.cell, { flex: 1 }]}>user</Typography>
		</View>
	);

	const renderItem = ({ item }: { item: ReportExportResponse }) => {
		return (
			<View style={styles.row}>
				<Typography style={[styles.cell, { flex: 0.5 }]}>{item.export_type}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>
					{item.start_date} - {item.end_date}
				</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>{item.timezone}</Typography>
				<Typography style={[styles.cell, { flex: 0.25 }]}>{item.lang}</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>{item.status}</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>{item.user_id}</Typography>
			</View>
		);
	};

	return (
		<Card variant={"standard"} style={styles.cardContainer}>
			<View style={styles.headerContainer}>
				<View style={styles.headerWithIconContainer}>
					<View style={styles.iconHeaderContainer}>
						<FontAwesome5
							name={"file-alt"}
							size={20}
							color={styles.fileAltIconColor.color}
						/>
					</View>
					<Typography variant={"h5"}>Управление отчетами</Typography>
				</View>

				<Button variant={"tint"} onPress={() => setIsVisibleExportReports(true)}>
					Generate Export
				</Button>
			</View>

			<LegendList
				data={exportReports ?? []}
				ListHeaderComponent={renderHeader}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
				recycleItems
				// onEndReachedThreshold={0.01}
			/>

			{isVisibleExportReports && (
				<ExportReportsDialog
					isVisible={isVisibleExportReports}
					onClose={() => setIsVisibleExportReports(false)}
				/>
			)}
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	cardContainer: {
		flex: 1,
		flexDirection: "column",
		width: "100%",
		paddingHorizontal: theme.spacing(2),
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
	},
	headerWithIconContainer: {
		flexWrap: "wrap",
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1),
	},
	iconHeaderContainer: {
		width: 48,
		height: 48,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.primary.mainOpacity,
		justifyContent: "center",
		alignItems: "center",
	},
	iconContentContainer: {
		width: 36,
		height: 36,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.primary.mainOpacity,
		justifyContent: "center",
		alignItems: "center",
	},
	fileAltIconColor: {
		color: theme.colors.primary.main,
	},
	content: {
		flex: 1,
		flexDirection: "row",
	},
	contentContainer: {
		flex: 1,
		flexDirection: "column",
		gap: theme.spacing(2),
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.border,
		backgroundColor: theme.colors.background.paper,
	},
	header: {
		backgroundColor: theme.colors.background.default,
	},
	cell: {
		paddingHorizontal: theme.spacing(1),
		paddingVertical: theme.spacing(0.5),
		fontSize: 14,
	},
}));
