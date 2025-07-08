import BasePopover from "@/ui/common/BasePopover";
import { Button, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { exportType, ReportStatus, useGetExportReportsInfinite } from "@/api/admin";
import { ScrollView, View, ViewProps } from "react-native";
import { formatToDate } from "@/core/utils/dateUtils";
import { StyleSheet } from "react-native-unistyles";
import downloadAndShareFile from "@/core/utils/downloadAndShareFile";
import { ApiUrl } from "@/constants";
import GetStatusBadge from "@/components/reports/StatusBadge";
import { useTranslation } from "react-i18next";

const LIMIT = 5;

interface ExportReportsPickerProps extends ViewProps {}

export default function ExportReportsPicker({ ...props }: ExportReportsPickerProps) {
	const { t } = useTranslation();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
		useGetExportReportsInfinite(
			{ limit: LIMIT },
			{
				query: {
					getNextPageParam: (lastPage, allPages) => {
						if (!lastPage || lastPage.length < LIMIT) return undefined;
						return allPages.length * LIMIT;
					},
				},
			}
		);
	console.log("data: ", data);

	const downloadExp = async (id: number, status: ReportStatus) => {
		console.log("status: ", status);
		const response = await exportType(id);
		await downloadAndShareFile(
			`${ApiUrl}/admin/export-reports/${id}/download`,
			response.filename
		);
	};

	return (
		<View style={{ zIndex: 10, minWidth: 300 }} {...props}>
			<BasePopover
				trigger={
					<Button>
						<FontAwesome5 name={"file"} size={16} /> Просмотреть репорты
					</Button>
				}
				itemHeight={400}
				isScrolled={false}
				maxWidth={300}
			>
				<ScrollView
					style={{ height: 400, maxHeight: 600, minWidth: 300 }}
					onScroll={({ nativeEvent }) => {
						const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
						const isBottom =
							layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
						if (isBottom && hasNextPage && !isFetchingNextPage) {
							console.log("fetchNextPage");
							fetchNextPage();
						}
					}}
					scrollEventThrottle={100}
				>
					{data?.pages?.map(pages =>
						pages.map(report => (
							<>
								<View style={styles.container}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										<Typography variant={"h6"} style={{ marginBottom: 4 }}>
											{report.export_type.toUpperCase()} —{" "}
											<GetStatusBadge reportStatus={report.status} />
										</Typography>
										<Button
											disabled={report.status !== ReportStatus.completed}
											onPress={() => downloadExp(report.id, report.status)}
										>
											<FontAwesome5 name={"download"} size={16} />
										</Button>
									</View>

									<Typography>
										{formatToDate(report.start_date)} →{" "}
										{formatToDate(report.end_date)}
									</Typography>

									{report.timezone && (
										<Typography>
											{t("reports.timezone")}: {report.timezone}
										</Typography>
									)}

									{report.user_full_name && (
										<Typography>
											{t("components.dailyAssignmentsList.user")}:{" "}
											{report.user_full_name}
										</Typography>
									)}
									{report.lang && (
										<Typography>
											{t("settings.language")}: {t(report.lang)}
										</Typography>
									)}
								</View>
								<View style={styles.divider} />
							</>
						))
					)}
					{isFetchingNextPage && <Typography>Loading more...</Typography>}
				</ScrollView>
			</BasePopover>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		padding: 12,
		marginBottom: 8,
		// borderRadius: 8,
		// borderWidth: 1,
		// borderColor: theme.colors.border,
		// backgroundColor: theme.colors.background.default,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.border,
	},
	iconTypographyContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(2),
	},
}));
