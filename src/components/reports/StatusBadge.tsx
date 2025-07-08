import { Typography } from "@/ui";
import React from "react";
import { useUnistyles } from "react-native-unistyles";
import { AssignmentStatus, ReportStatus } from "@/api/admin";
import { useTranslation } from "react-i18next";
import { TypographyProps } from "@/ui/common/Typography";
import { View } from "react-native";
import { getStatusStyle } from "@/core/utils/getStatusStyle";

interface Props extends TypographyProps {
	status?: AssignmentStatus;
	reportStatus?: ReportStatus;
	text?: string;
	color?: any;
}

export default function GetStatusBadge({ status, reportStatus, text, color, ...props }: Props) {
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
						alignSelf: "flex-start", // если надо под контент
					},
					props?.style,
				]}
			>
				<Typography
					style={[
						{
							color: theme.colors.not_started.main,
						},
						{ color: color },
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
