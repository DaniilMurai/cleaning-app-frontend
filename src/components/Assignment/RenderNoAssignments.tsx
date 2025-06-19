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
					<Card variant={"default"} style={styles.noAssignmentCard}>
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
					<Card variant={"default"} style={styles.noAssignmentCard}>
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
						<Typography variant="h5" style={{ alignSelf: "center", marginBottom: 8 }}>
							{t("admin.noAssignmentsPlanned", {
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

	iconContainer: {
		backgroundColor: theme.colors.primary.mainOpacity,
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
