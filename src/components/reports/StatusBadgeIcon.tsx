import { Text, View, ViewProps } from "react-native";
import React from "react";
import { useUnistyles } from "react-native-unistyles";
import { AssignmentStatus, ReportStatus } from "@/api/admin";
import { useTranslation } from "react-i18next";
import { getStatusStyle } from "@/core/utils/getStatusStyle";
import { Feather, FontAwesome5, MaterialIcons } from "@expo/vector-icons"; // любые нужные библиотеки

interface StatusBadgeIconProps extends ViewProps {
	status?: AssignmentStatus;
	reportStatus?: ReportStatus;
	size?: number;
	showLabel?: boolean;
}

export default function StatusBadgeIcon({
	status,
	reportStatus,
	size = 32,
	showLabel = false,
	style,
	...props
}: StatusBadgeIconProps) {
	const { theme } = useUnistyles();
	const { t } = useTranslation();

	const key = reportStatus ?? status ?? "not_started";
	const config = getStatusStyle(key, theme, t);

	const iconMap: Record<string, React.ReactElement> = {
		waiting: <Feather name="clock" />,
		in_progress: <Feather name="loader" />,
		failed: <MaterialIcons name="error-outline" />,
		completed: <FontAwesome5 name="check" />,
		// fallback:
		default: <Feather name="help-circle" />,
	};

	const icon = iconMap[key] ?? iconMap.default;

	return (
		<View
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					borderRadius: size / 2,
					paddingHorizontal: showLabel ? theme.spacing(1) : 0,
					paddingVertical: theme.spacing(0.25),
				},
				style,
			]}
			{...props}
		>
			<View
				style={{
					width: size,
					height: size,
					borderRadius: size / 2,
					backgroundColor: config.style.backgroundColor,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{React.cloneElement(icon, {
					color: config.style.color,
					size: size * 0.5,
				})}
			</View>
			{showLabel && (
				<Text style={{ marginLeft: theme.spacing(1), color: config.style.color }}>
					{config.label}
				</Text>
			)}
		</View>
	);
}
