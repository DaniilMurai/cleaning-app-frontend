import { Typography } from "@/ui";
import React from "react";
import { useUnistyles } from "react-native-unistyles";
import { AssignmentStatus, ReportStatus } from "@/api/admin";
import { useTranslation } from "react-i18next";

interface Props {
	status?: AssignmentStatus;
	reportStatus?: ReportStatus;
}

export default function GetStatusBadge({ status, reportStatus }: Props) {
	const { theme } = useUnistyles();
	const { t } = useTranslation();

	const statusConfig = {
		completed: {
			label: t("components.status.completed") || "Completed",
			style: {
				backgroundColor: theme.colors.success.background, // green-100
				color: theme.colors.success.textOnBackground, // green-800
			},
		},
		partially_completed: {
			label: t("components.status.partially_completed") || "Partially Completed",
			style: {
				color: theme.colors.warning.main,
				backgroundColor: theme.colors.warning.background,
			},
		},
		in_progress: {
			label: t("components.status.in_progress") || "In Progress",
			style: {
				backgroundColor: theme.colors.progress.background, // blue-100
				color: theme.colors.progress.main, // blue-800
			},
		},
		not_started: {
			label: t("components.status.not_started") || "Not Started",
			style: {
				backgroundColor: theme.colors.not_started.background, // gray-100
				color: theme.colors.not_started.main, // gray-800
			},
		},
		not_completed: {
			label: t("components.status.not_completed") || "Not Completed",
			style: {
				backgroundColor: theme.colors.error.background,
				color: theme.colors.error.main,
			},
		},
		waiting: {
			label: t("components.status.waiting") || "Waiting",
			style: {
				backgroundColor: theme.colors.not_started.background,
				color: theme.colors.not_started.main,
			},
		},
		failed: {
			label: t("components.status.failed") || "Failed",
			style: {
				backgroundColor: theme.colors.error.background,
				color: theme.colors.error.main,
			},
		},
		expired: {
			label: t("components.status.expired") || "Expired",
			style: {
				backgroundColor: theme.colors.error.background,
				color: theme.colors.error.main,
			},
		},
	};

	const key =
		reportStatus && statusConfig[reportStatus as keyof typeof statusConfig]
			? reportStatus
			: status && statusConfig[status as keyof typeof statusConfig]
				? status
				: "not_started";

	const config = statusConfig[key as keyof typeof statusConfig];

	return (
		<Typography
			style={[
				config.style,
				{
					paddingVertical: theme.spacing(0.25),
					paddingHorizontal: theme.spacing(1.25),
					borderRadius: theme.spacing(10),
				},
			]}
		>
			{config.label}
		</Typography>
	);
}
