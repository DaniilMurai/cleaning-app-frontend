import { Typography } from "@/ui";
import React from "react";
import { useUnistyles } from "react-native-unistyles";

const getStatusBadge = (status: string) => {
	const { theme } = useUnistyles();
	const statusConfig = {
		completed: {
			label: "Completed",
			style: {
				backgroundColor: theme.colors.success.background, // green-100
				color: theme.colors.success.textOnBackground, // green-800
			},
		},
		partially_completed: {
			label: "Partially Completed",
			style: {
				backgroundColor: theme.colors.warning.main,
				color: theme.colors.warning.dark,
			},
		},
		in_progress: {
			label: "In Progress",
			style: {
				backgroundColor: theme.colors.progress.background, // blue-100
				color: theme.colors.progress.main, // blue-800
			},
		},
		not_started: {
			label: "Not Started",
			style: {
				backgroundColor: theme.colors.not_started.background, // gray-100
				color: theme.colors.not_started.main, // gray-800
			},
		},
	};

	const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;

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
};

export default getStatusBadge;
