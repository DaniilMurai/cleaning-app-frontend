import { getFormatedDate } from "@/core/utils/dateUtils";
import { View } from "react-native";
import { Card, Typography } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";

interface props {
	selectedDate: Date;
}

export default function NoAssignments({ selectedDate }: props) {
	const { t } = useTranslation();

	const handleReturn = () => {
		if (getFormatedDate(selectedDate) === getFormatedDate(new Date())) {
			return (
				<View style={styles.emptyStateContainer}>
					<Card variant={"standard"} style={styles.noAssignmentCard}>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View style={styles.iconContainer}>
								<FontAwesome5
									name={"clock"}
									color={styles.iconColor.color}
									size={26}
								/>
							</View>
						</View>
						<Typography
							color="primary"
							variant="h4"
							style={{ textAlign: "center", marginBottom: 8 }}
						>
							{t("admin.noAssignmentsForToday")}
						</Typography>
						<Typography variant="body1" style={{ textAlign: "center" }}>
							{t("admin.enjoyTime")}
						</Typography>
					</Card>
				</View>
			);
		} else {
			return (
				<View style={styles.emptyStateContainer}>
					<Card variant={"standard"} style={styles.noAssignmentCard}>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<View
								style={[
									styles.iconContainer,
									getFormatedDate(selectedDate) < getFormatedDate(new Date())
										? styles.iconContainerSuccess
										: styles.iconContainerPrimary,
								]}
							>
								{getFormatedDate(selectedDate) < getFormatedDate(new Date()) ? (
									<FontAwesome5
										name={"check"}
										color={styles.iconColorCheck.color}
										size={26}
									/>
								) : (
									<FontAwesome5
										name={"clock"}
										color={styles.iconColor.color}
										size={26}
									/>
								)}
							</View>
						</View>
						<Typography variant="h5" style={{ alignSelf: "center", marginBottom: 8 }}>
							{getFormatedDate(selectedDate) < getFormatedDate(new Date())
								? t("admin.noAssignmentsWasPlanned", {
										date: getFormatedDate(selectedDate),
									})
								: t("admin.noAssignmentsPlanned", {
										date: getFormatedDate(selectedDate),
									})}
						</Typography>
					</Card>
				</View>
			);
		}
	};

	return handleReturn();
}

const styles = StyleSheet.create(theme => ({
	emptyStateContainer: {
		flex: 1,
		textAlign: "center",
	},
	iconColor: {
		color: theme.colors.primary.main,
	},
	iconColorCheck: {
		color: theme.colors.success.main,
	},
	iconContainerPrimary: {
		backgroundColor: theme.colors.primary.mainOpacity,
	},
	iconContainerSuccess: {
		backgroundColor: theme.colors.success.background,
	},
	iconContainer: {
		borderRadius: theme.borderRadius(999),
		padding: theme.spacing(2),
	},
	noAssignmentCard: {
		paddingVertical: {
			xs: theme.spacing(3),
			md: theme.spacing(8),
		},
		paddingHorizontal: theme.spacing(3),
		width: "100%",
	},
}));
