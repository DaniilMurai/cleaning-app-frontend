import { Typography } from "@/ui";
import React from "react";
import { useUnistyles } from "react-native-unistyles";
import { AssignmentStatus, ReportStatus } from "@/api/admin";
import { useTranslation } from "react-i18next";
import { View, ViewProps } from "react-native";
import { getStatusStyle } from "@/core/utils/getStatusStyle";

interface Props extends ViewProps {
	status?: AssignmentStatus;
	reportStatus?: ReportStatus;
	text?: string;
	color?: any;
	fontSize?: number;
}

export default function GetStatusBadge({
	status,
	reportStatus,
	text,
	color,
	fontSize,
	...props
}: Props) {
	const { theme } = useUnistyles();
	const { t } = useTranslation();

	if (text) {
		return (
			<View
				style={[
					{
						borderRadius: theme.spacing(10),
						backgroundColor: theme.colors.not_started.background,
						paddingVertical: theme.spacing(0.25),
						paddingHorizontal: theme.spacing(1.25),
						alignSelf: "flex-start",
					},
					props?.style,
				]}
			>
				<Typography
					style={[
						{
							color: color ?? theme.colors.not_started.main,
							fontSize: fontSize,
						},
					]}
				>
					{text}
				</Typography>
			</View>
		);
	}
	const key = reportStatus ?? status ?? "not_started";
	const config = getStatusStyle(key, theme, t);

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
