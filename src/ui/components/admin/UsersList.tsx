// src/components/admin/UsersList.tsx
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { UserSchema } from "@/api/admin";
import { FontAwesome5 } from "@expo/vector-icons";
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
					{!isSuperAdmin && (user.role === "admin" || user.role === "superadmin") ? (
						<></>
					) : (
						<>
							<View style={styles.actionButtons}>
								<Button variant="tint" onPress={() => onForgetPassword(user.id)}>
									<FontAwesome5 name="unlock" size={20} />
								</Button>
								<Button variant="tint" onPress={() => onActivateUser(user.id)}>
									<FontAwesome5 name="user-check" size={20} />
								</Button>
							</View>
							<View style={styles.actionButtons}>
								<Button variant="tint" onPress={() => onEditUser(user)}>
									<FontAwesome5 name="edit" size={20} />
								</Button>
								<Button variant="tint" onPress={() => onDeleteUser(user.id)}>
									<FontAwesome5 name="trash-alt" size={20} />
								</Button>
							</View>
						</>
					)}
					{/*<View style={styles.actionButtons}>*/}
					{/*	<Button variant="tint" onPress={() => onForgetPassword(user.id)}>*/}
					{/*		<FontAwesome5 name="key" size={20} />*/}
					{/*	</Button>*/}
					{/*</View>*/}
					{/*<View style={styles.actionButtons}>*/}
					{/*	<Button variant="tint" onPress={() => onEditUser(user)}>*/}
					{/*		<FontAwesome5 name="edit" size={20} />*/}
					{/*	</Button>*/}
					{/*	<Button variant="tint" onPress={() => onDeleteUser(user.id)}>*/}
					{/*		<FontAwesome5 name="trash-alt" size={20} />*/}
					{/*	</Button>*/}
					{/*</View>*/}
				</Card>
			))}
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	heading: {
		marginBottom: theme.spacing(3),
		flexDirection: "row",
		justifyContent: "space-between",
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
	actionButtons: {
		flexDirection: "column",
		gap: theme.spacing(1),
		alignItems: "center",
	},
	icon: {
		color: theme.colors.primary.main,
	},
}));
