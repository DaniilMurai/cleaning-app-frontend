import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/Typography";
import { useState } from "react";
import { Button, Card, ModalContainer } from "@/ui";
import useAuth from "@/context/AuthContext";
import { UpdateUserData, UserUpdatePassword } from "@/api/users";
import UpdateCurrentUserForm from "@/ui/formComponents/UpdateCurrentUserForm";
import { useCurrentUserMutations } from "@/hooks/useCurrentUserMutations";
import UpdateCurrentUserPasswordForm from "@/ui/formComponents/UpdateCurrentUserPasswordForm";

export default function ProfilePage() {
	const [error, setError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const { logout, user, refreshUserData } = useAuth();

	const handleLogout = async () => {
		try {
			setError("");
			await logout();
		} catch (error) {
			setError("Couldn't log out: " + error);
		}
	};

	const {
		handleUpdateCurrentUser,
		updateMutation,
		handleChangePassword,
		changePasswordMutation,
	} = useCurrentUserMutations({
		onSuccessUpdate: () => {
			setIsEditing(false);
		},
		onSuccessChangePassword: () => {
			setIsChangingPassword(false);
		},
		refetch: refreshUserData,
	});

	const handleEditSubmit = async (userData: Partial<UpdateUserData>) => {
		try {
			await handleUpdateCurrentUser(userData as UpdateUserData);
			console.log("Update user data:", userData);
			// setIsEditing(false);
		} catch (error) {
			setError("Failed to update user data: " + error);
		}
	};

	const handleChangingPasswordSubmit = async (userData: UserUpdatePassword) => {
		try {
			await handleChangePassword(userData as UserUpdatePassword);
			console.log("Update user password:", userData);
		} catch (error) {
			setError("Failed to update user password: " + error);
		}
	};

	return (
		<View style={styles.container}>
			<Card size="large" variant="outlined" style={styles.cardContainer}>
				<View style={styles.header}>
					<Typography variant="h4" style={styles.userName}>
						{user?.full_name || user?.nickname || "User"}
					</Typography>
					<View style={{ flex: 1 }} />
					<Button variant="outlined" onPress={handleLogout}>
						Выйти
					</Button>
				</View>

				<View style={styles.divider} />

				<View style={styles.infoSection}>
					<InfoItem label="Логин" value={user?.nickname || "-"} />
					<InfoItem label="Полное имя" value={user?.full_name || "-"} />
				</View>

				<View style={styles.divider} />

				<View style={styles.buttonsContainer}>
					<Button
						variant="outlined"
						size="small"
						onPress={() => setIsEditing(true)}
						// startIcon={<AntDesign name="edit" size={16} />}
					>
						Редактировать
					</Button>
					<Button
						variant="outlined"
						size="small"
						onPress={() => setIsChangingPassword(true)}
					>
						Сменить пароль
					</Button>
				</View>

				{error ? (
					<Typography color="error" style={styles.errorText}>
						Ошибка: {error}
					</Typography>
				) : null}
			</Card>

			<ModalContainer onClose={() => setIsEditing(false)} visible={isEditing}>
				<UpdateCurrentUserForm
					user={user as UpdateUserData}
					onClose={() => setIsEditing(false)}
					onSubmit={handleEditSubmit}
					isLoading={updateMutation.isPending}
				/>
			</ModalContainer>

			<ModalContainer
				onClose={() => setIsChangingPassword(false)}
				visible={isChangingPassword}
			>
				<UpdateCurrentUserPasswordForm
					onClose={() => setIsChangingPassword(false)}
					onSubmit={handleChangingPasswordSubmit}
					isLoading={changePasswordMutation.isPending}
				/>
			</ModalContainer>
		</View>
	);
}

// Вспомогательный компонент для отображения информации пользователя
function InfoItem({ label, value }: { label: string; value: string }) {
	return (
		<View style={styles.infoItem}>
			<Typography variant="body2" style={styles.infoLabel}>
				{label}:
			</Typography>
			<Typography variant="body1" style={styles.infoValue}>
				{value}
			</Typography>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: theme.spacing(2),
		backgroundColor: theme.colors.background.main,
	},
	cardContainer: {
		flex: 1,
		padding: theme.spacing(3),
		margin: theme.spacing(3),
		backgroundColor: theme.colors.background.main,
		maxWidth: 600,
		width: "100%",
		alignSelf: "center",
		borderRadius: theme.spacing(2),
		shadowColor: theme.colors.background.paper,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: theme.spacing(3),
	},
	avatarContainer: {
		marginRight: theme.spacing(3),
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: theme.colors.primary.light,
	},
	avatarPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: theme.colors.background.paper,
		justifyContent: "center",
		alignItems: "center",
	},
	userName: {
		marginBottom: theme.spacing(1),
		fontWeight: "bold",
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	infoSection: {
		marginVertical: theme.spacing(2),
	},
	infoItem: {
		flexDirection: "row",
		marginBottom: theme.spacing(2),
		paddingHorizontal: theme.spacing(1),
	},
	infoLabel: {
		width: 100,
		fontWeight: "500",
		color: theme.colors.text.secondary,
	},
	infoValue: {
		flex: 1,
		color: theme.colors.text.primary,
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		marginTop: theme.spacing(3),
	},
	errorText: {
		marginTop: theme.spacing(2),
		textAlign: "center",
	},
}));
