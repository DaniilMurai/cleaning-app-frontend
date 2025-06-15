// src/components/admin/UsersList.tsx
import { DimensionValue, useWindowDimensions, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";
import DropdownMenu from "@/ui/common/DropdownMenu";
import { UserSchema } from "@/api/admin";
import { useTranslation } from "react-i18next";
import { useIsSuperAdmin } from "@/core/auth";

interface UsersListProps {
	users: UserSchema[];
	onForgetPassword: (userId: number) => void;
	onActivateUser: (userId: number) => void;
	onEditUser: (user: UserSchema) => void;
	onDeleteUser: (userId: number) => void;
	manyColumns?: boolean;
}

export default function UsersList({
	users,
	onForgetPassword,
	onActivateUser,
	onEditUser,
	onDeleteUser,
	manyColumns,
}: UsersListProps) {
	const { t } = useTranslation();
	const isSuperAdmin = useIsSuperAdmin();

	const { width } = useWindowDimensions();
	const columns = width > 920 ? 3 : width > 835 ? 2 : 1;
	const cardWidth: DimensionValue = `${100 / columns - 3}%`; // небольшой отступ

	return (
		<View
			style={[
				styles.container,
				manyColumns && {
					flexDirection: "row",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 16,
				},
			]}
		>
			{users?.map(user => (
				<Card
					key={user.id}
					style={[
						styles.userCard,
						manyColumns && {
							width: cardWidth,
							margin: 8,
							alignSelf: "flex-start",
						},
					]}
				>
					<View style={styles.userInfo}>
						<Typography variant="h6">{user.full_name}</Typography>
						<Typography variant="body1">
							{t("components.usersList.role")}: {user.role}
						</Typography>
						<Typography variant="body1">
							{t("components.usersList.status")}: {user.status}
						</Typography>
						<Typography variant="body2" style={styles.noteText}>
							{t("components.usersList.adminNote")}: {user.admin_note || "N/A"}
						</Typography>
					</View>

					{!isSuperAdmin &&
					(user.role === "admin" || user.role === "superadmin") ? null : (
						<View style={styles.actionsContainer}>
							<DropdownMenu
								placement={"left"}
								items={[
									{
										label: t("components.usersList.resetPassword"),
										icon: "unlock",
										onPress: () => onForgetPassword(user.id),
										// Показывать только если статус не pending или disabled
										condition:
											user.status !== "pending" && user.status !== "disabled",
									},
									{
										label: t("components.usersList.activate"),
										icon: "user-check",
										onPress: () => onActivateUser(user.id),
										// Показывать только если статус не active или disabled
										condition:
											user.status !== "active" && user.status !== "disabled",
									},
									{
										label: t("components.usersList.edit"),
										icon: "edit",
										onPress: () => onEditUser(user),
									},
									{
										label: t("components.usersList.delete"),
										icon: "trash-alt",
										onPress: () => onDeleteUser(user.id),
									},
								]}
							/>
						</View>
					)}
				</Card>
			))}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
	},
	userCard: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		flexDirection: "row",
		justifyContent: "space-between",
	},
	userInfo: {
		flex: 1,
	},
	noteText: {
		marginTop: theme.spacing(1),
		color: theme.colors.text.secondary,
	},
	actionsContainer: {
		justifyContent: "center",
		alignItems: "flex-start",
	},
}));
