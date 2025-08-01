import {
	GetReportsParams,
	ReportWithAssignmentDateResponse,
	useGetReportsInfinite,
} from "@/api/admin";
import React, { useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button, Typography } from "@/ui";
import { formatTime, formatToDate, formatToDateTime, formatToTime } from "@/core/utils/dateUtils";
import { LegendList } from "@legendapp/list";
import GetStatusBadge from "@/components/reports/StatusBadge";
import { useTranslation } from "react-i18next";
import ExportReportsDialog from "@/components/reports/ExportReportsDialog";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
	queryParams: Partial<GetReportsParams>;
}

const LIMIT = 20;

export default function ReportsTable({ queryParams }: Props) {
	const { t } = useTranslation();
	const params = { ...queryParams, limit: LIMIT };
	const {
		data: reports,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetReportsInfinite(params, {
		query: {
			getNextPageParam: (lastPage, allPages) => {
				if (!lastPage || lastPage.length < LIMIT) return undefined;
				return allPages.length * LIMIT;
			},
		},
	});
	const [showCreateExport, setShowCreateExport] = useState<boolean>(false);

	const data = reports?.pages?.flat() ?? [];

	const renderHeader = () => (
		<View style={{ flex: 1 }}>
			<View
				style={[
					{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 12,
						paddingTop: 8,
					},
					styles.header,
				]}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						gap: 12,
					}}
				>
					<FontAwesome5 name={"file-alt"} color={styles.iconColor.color} size={20} />

					<Typography variant={"h5"}>{t("reports.reports")}</Typography>
				</View>
				{/*<ExportReportsPicker />*/}

				<Button
					variant={"contained"}
					color={"black"}
					size={"large"}
					onPress={() => setShowCreateExport(true)}
				>
					{t("reports.create_export")}
				</Button>
			</View>
			<View style={[styles.row, styles.header, { height: 48 }]}>
				<Typography style={[styles.cell, { flex: 2 }]}>
					{t("components.reportsTable.username")}
				</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>
					{t("components.reportsTable.location")}
				</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>
					{t("components.reportsTable.date")}
				</Typography>
				<Typography style={[styles.cell, { flex: 2.5 }]}>
					{t("components.reportsTable.status")}
				</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>
					{t("components.reportsTable.start")}
				</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>
					{t("components.reportsTable.end")}
				</Typography>
				<Typography style={[styles.cell, { flex: 1.5 }]}>
					{t("components.reportsTable.duration")}
				</Typography>
			</View>
		</View>
	);

	const renderItem = ({ item }: { item: ReportWithAssignmentDateResponse }) => {
		const date = item.assignment_date ?? "—";
		const locationName = item.location_name;
		const durationInMs = item.duration_seconds ? item.duration_seconds * 1000 : 0;
		const duration = formatTime(durationInMs);
		const userFullName = item.user_full_name;

		let start_time = "-";
		if (item.start_time) {
			if (formatToDate(date) === formatToDate(item.start_time)) {
				start_time = formatToTime(item.start_time);
			} else {
				start_time = formatToDateTime(item.start_time);
			}
		}

		let end_time = "-";
		if (item.end_time) {
			if (formatToDate(date) === formatToDate(item.end_time)) {
				end_time = formatToTime(item.end_time);
			} else {
				end_time = formatToDateTime(item.end_time);
			}
		}

		return (
			<View style={[styles.row]}>
				<Typography style={[styles.cell, { flex: 2 }]}>{userFullName}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{locationName}</Typography>
				<Typography style={[styles.cell, { flex: 2 }]}>{date}</Typography>
				<Typography style={[styles.cell, { flex: 2.5 }]}>
					<GetStatusBadge status={item.status} />
				</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>{start_time}</Typography>
				<Typography style={[styles.cell, { flex: 1 }]}>{end_time}</Typography>
				<Typography style={[styles.cell, { flex: 1.5 }]}>{duration}</Typography>
			</View>
		);
	};

	return (
		<ScrollView
			horizontal
			nestedScrollEnabled // Android: позволяет вертикальному и горизонтальному скроллам работать вместе
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{ width: "100%", minWidth: 140 * 7 }}
		>
			<LegendList
				data={data ?? []}
				keyExtractor={(item, index) => `${item.id}-${index}`}
				estimatedItemSize={48}
				// Ширина списка равна контенту, а не экрану
				style={{ minWidth: 118 * 7 }}
				ListHeaderComponent={renderHeader}
				renderItem={renderItem}
				recycleItems
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.2}
				ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
			/>
			<ExportReportsDialog
				isVisible={showCreateExport}
				onClose={() => setShowCreateExport(false)}
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create(theme => ({
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
	legendList: {
		borderRadius: theme.spacing(8),
		borderColor: theme.colors.border,
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
}));
