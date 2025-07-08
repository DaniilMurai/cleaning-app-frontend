import { AssignmentStatus, ReportStatus } from "@/api/admin";
import { TFunction } from "i18next";

export const getStatusStyle = (
	key: AssignmentStatus | ReportStatus | string,
	theme: any,
	t: TFunction
) => {
	const config = {
		completed: {
			label: t("components.status.completed") || "Completed",
			style: {
				backgroundColor: theme.colors.success.background,
				color: theme.colors.success.textOnBackground,
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
				backgroundColor: theme.colors.progress.background,
				color: theme.colors.progress.main,
			},
		},
		not_started: {
			label: t("components.status.not_started") || "Not Started",
			style: {
				backgroundColor: theme.colors.not_started.background,
				color: theme.colors.not_started.main,
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

	return config[key as keyof typeof config] ?? config.not_started;
};
