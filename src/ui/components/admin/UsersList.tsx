// src/components/admin/UsersList.tsx
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import DropdownMenu from "@/ui/DropdownMenu";
import { UserSchema } from "@/api/admin";
import { useTranslation } from "react-i18next";
import { useIsSuperAdmin } from "@/context/AuthContext";

interface UsersListProps {
	users: UserSchema[];
	onForgetPassword: (userId: number) => void;
	onActivateUser: (userId: number) => void;
	onEditUser: (user: UserSchema) => void;
	onDeleteUser: (userId: number) => void;
}

export default function UsersList({
	users,
	onForgetPassword,
	onActivateUser,
	onEditUser,
	onDeleteUser,
}: UsersListProps) {
	const { t } = useTranslation();
	const isSuperAdmin = useIsSuperAdmin();

	return (
		<>
			{users?.map(user => (
				<Card key={user.id} style={styles.userCard}>
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
		</>
	);
}

const styles = StyleSheet.create(theme => ({
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
