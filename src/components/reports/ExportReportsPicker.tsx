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
import StatusBadgeIcon from "./StatusBadgeIcon";
import { useTranslation } from "react-i18next";

const LIMIT = 7;
const USER_FULL_NAME_LEN_LIMIT = 20;

interface ExportReportsPickerProps extends ViewProps {}

export default function ExportReportsPicker({ ...props }: ExportReportsPickerProps) {
	const { t } = useTranslation();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetExportReportsInfinite(
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

	function editUserFullName(fullName: string) {
		const len = fullName.length;
		if (len <= USER_FULL_NAME_LEN_LIMIT) return fullName;

		for (let i = USER_FULL_NAME_LEN_LIMIT; i >= 0; i--) {
			if (fullName[i] === " " && i <= USER_FULL_NAME_LEN_LIMIT) return fullName.slice(0, i);
		}
		return fullName.slice(0, USER_FULL_NAME_LEN_LIMIT - 2) + "..";
	}

	return (
		<View {...props}>
			<BasePopover
				buttonTriggerVariant={"contained"}
				buttonTriggerColor={"black"}
				buttonTriggerSize={"large"}
			>
				<ScrollView
					style={{ height: 400 }}
					onScroll={({ nativeEvent }) => {
						const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
						const isBottom =
							layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
						if (isBottom && hasNextPage && !isFetchingNextPage) {
							console.log("fetchNextPage");
							fetchNextPage();
						}
					}}
					showsVerticalScrollIndicator={false}
					scrollEventThrottle={100}
					// contentContainerStyle={{  }}
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
										<StatusBadgeIcon reportStatus={report.status} />

										<Typography variant={"h6"} style={{ marginBottom: 4 }}>
											{formatToDate(report.start_date)} →{" "}
											{formatToDate(report.end_date)}
										</Typography>
										<Button
											disabled={report.status !== ReportStatus.completed}
											onPress={() => downloadExp(report.id, report.status)}
										>
											<FontAwesome5 name={"download"} size={16} />
										</Button>
									</View>
									<View style={styles.badgesContainer}>
										<GetStatusBadge
											text={report.export_type.toUpperCase()}
											style={styles.formatLabel}
											color={styles.formatLabel.color}
											fontSize={14}
										/>
										{report.timezone && (
											<GetStatusBadge
												text={report.timezone}
												style={styles.timezoneLabel}
												color={styles.timezoneLabel.color}
												fontSize={14}
											/>
										)}
										{report.lang && (
											<GetStatusBadge
												style={styles.langLabel}
												text={report.lang.toUpperCase()}
												color={styles.langLabel.color}
												fontSize={14}
											/>
										)}
										{report.user_full_name && (
											<GetStatusBadge
												text={editUserFullName(report.user_full_name)}
												style={styles.userLabel}
												color={styles.userLabel.color}
												fontSize={14}
											/>
											// <Typography variant={"body2"}>
											// 	<FontAwesome5 name={"user"} size={16} />{" "}
											// 	{report.user_full_name}
											// </Typography>
										)}
									</View>
								</View>
								<View style={styles.divider} />
							</>
						))
					)}
					{isFetchingNextPage && <Typography>{t("common.loading")}</Typography>}
				</ScrollView>
			</BasePopover>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		// padding: 12,
		// marginBottom: 8,
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
	langLabel: {
		color: theme.colors.warning.main,
		backgroundColor: theme.colors.warning.background,
	},
	formatLabel: {
		color: theme.colors.secondary.main,
		backgroundColor: theme.colors.secondary.background,
	},
	timezoneLabel: {
		color: theme.colors.primary.main,
		backgroundColor: theme.colors.primary.mainOpacity,
	},
	userLabel: {
		color: theme.colors.progress.main,
		backgroundColor: theme.colors.progress.background,
	},
	badgesContainer: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	iconWithBackgroundContainer: {
		width: 36,
		height: 36,
		borderRadius: theme.borderRadius(10),
		// backgroundColor: theme.colors.primary.mainOpacity,
		justifyContent: "center",
		alignItems: "center",
	},
}));
