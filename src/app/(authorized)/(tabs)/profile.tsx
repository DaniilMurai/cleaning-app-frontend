import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/common/Typography";
import { useState } from "react";
import { Button, Card, ModalContainer } from "@/ui";
import useAuth from "@/core/context/AuthContext";
import { UpdateUserData, UserUpdatePassword } from "@/api/users";
import UpdateCurrentUserForm from "@/ui/forms/user/UpdateCurrentUserForm";
import { useCurrentUserMutations } from "@/core/hooks/mutations/useCurrentUserMutations";
import UpdateCurrentUserPasswordForm from "@/ui/forms/user/UpdateCurrentUserPasswordForm";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SettingsModal from "@/ui/components/settings/SettingsModal";

export default function ProfilePage() {
	const { t } = useTranslation();

	const [isEditing, setIsEditing] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const { logout, user, refreshUserData } = useAuth();
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

	const [errorState, setErrorState] = useState({
		logoutError: "",
		updateError: "",
		changePasswordError: "",
	});

	const handleLogout = async () => {
		try {
			setErrorState(prevState => ({
				...prevState,
				logoutError: "",
			}));
			await logout();
		} catch (error) {
			setErrorState(prevState => ({
				...prevState,
				logoutError: "Couldn't log out: " + error,
			}));
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
			setErrorState(prevState => ({
				...prevState,
				updateError: "Failed to update user data: " + error,
			}));
		}
	};

	const handleChangingPasswordSubmit = async (userData: UserUpdatePassword) => {
		try {
			// Сбрасываем ошибку при начале запроса
			setErrorState(prevState => ({
				...prevState,
				changePasswordError: "",
			}));

			await handleChangePassword(userData as UserUpdatePassword);
			console.log("Update user password:", userData);
		} catch (error) {
			setErrorState(prevState => ({
				...prevState,
				changePasswordError: "Failed to update user password: " + error,
			}));
		}
	};

	return (
		<View style={styles.container}>
			<Card size="large" variant="outlined" style={styles.cardContainer}>
				<View style={styles.header}>
					<Typography variant="h5" style={styles.userName}>
						{user?.full_name || user?.nickname || "User"}
					</Typography>
					<View style={{ flex: 1 }} />
					<Button variant={"contained"} onPress={() => setIsEditing(true)}>
						<FontAwesome5 name="user-edit" size={20} />
					</Button>
					<Button variant="outlined" onPress={() => setIsSettingsModalOpen(true)}>
						<FontAwesome5 name="cog" size={20} />
					</Button>

					<Button variant="contained" onPress={handleLogout}>
						<FontAwesome5 name="sign-out-alt" size={20} />
					</Button>
				</View>

				<View style={styles.divider} />

				<View style={styles.infoSection}>
					<InfoItem label={t("auth.login")} value={user?.nickname || "-"} />
					<InfoItem label={t("profile.fullName")} value={user?.full_name || "-"} />
				</View>

				<View style={styles.divider} />

				<View style={styles.buttonsContainer}>
					<Button
						variant="outlined"
						size="small"
						onPress={() => setIsChangingPassword(true)}
					>
						{t("profile.changePassword")}
					</Button>
				</View>

				{errorState.logoutError ? (
					<Typography color="error" style={styles.errorText}>
						{t("common.error")}: {errorState.logoutError}
					</Typography>
				) : null}
			</Card>

			<SettingsModal
				isVisible={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
			/>

			<ModalContainer
				onClose={() => {
					setErrorState(prevState => ({ ...prevState, updateError: "" }));
					setIsEditing(false);
				}}
				visible={isEditing}
			>
				<UpdateCurrentUserForm
					user={user as UpdateUserData}
					onClose={() => {
						setErrorState(prevState => ({ ...prevState, updateError: "" }));
						setIsEditing(false);
					}}
					onSubmit={handleEditSubmit}
					isLoading={updateMutation.isPending}
					error={errorState.updateError}
				/>
			</ModalContainer>

			<ModalContainer
				onClose={() => {
					setIsChangingPassword(false);
					setErrorState(prevState => ({
						...prevState,
						changePasswordError: "",
					}));
				}}
				visible={isChangingPassword}
			>
				<UpdateCurrentUserPasswordForm
					onClose={() => {
						setIsChangingPassword(false);
						setErrorState(prevState => ({
							...prevState,
							changePasswordError: "",
						}));
					}}
					onSubmit={handleChangingPasswordSubmit}
					isLoading={changePasswordMutation.isPending}
					error={errorState.changePasswordError}
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
		gap: theme.spacing(2),
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
		marginVertical: theme.spacing(0.5),
	},
	infoSection: {
		marginVertical: theme.spacing(0.5),
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
		flexWrap: "wrap",
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
