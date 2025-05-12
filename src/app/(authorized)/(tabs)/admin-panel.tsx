import { Alert, Modal, Platform, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { Button } from "@/ui";
import { useState } from "react";
import { UserSchema } from "@/api/admin/schemas/userSchema";
import {
	RegisterUserData,
	useCreateUser,
	useDeleteUser,
	useGetUsers,
	useUpdateUser,
} from "@/api/admin";
import Loading from "@/ui/Loading";
import EditUserForm from "@/ui/formComponents/EditUserForm";
import CreateUserForm from "@/ui/formComponents/CreateUserForm";
import GetInviteLinkForm from "@/ui/formComponents/GetInviteLinkForm";

export default function AdminPanelPage() {
	const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [isCreateMode, setIsCreateMode] = useState(false);

	const [inviteLink, setInviteLink] = useState("");
	const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);

	// Получаем список пользователей
	const { data: users, isLoading, refetch } = useGetUsers({});

	const updateMutation = useUpdateUser({
		mutation: {
			onSuccess: () => {
				if (Platform.OS === "web") {
					window.alert("Success, User updated successfully");
				} else {
					Alert.alert("Success", "User updated successfully");
				}
				setIsEditMode(false);
				setSelectedUser(null);
				refetch();
			},
			onError: error => {
				if (Platform.OS === "web") {
					window.alert("Error: " + error.message || "Failed to update user");
				} else {
					Alert.alert("Error", error.message || "Failed to update user");
				}
			},
		},
	});

	const createMutation = useCreateUser({
		mutation: {
			onSuccess: data => {
				const invite_link = data.invite_link;
				setInviteLink(invite_link);
				setShowInviteLinkModal(true);
				setIsCreateMode(false);
				refetch();
			},
			onError: error => {
				if (Platform.OS === "web") {
					window.alert("Error: " + error.message || "Failed to create user");
				} else {
					Alert.alert("Error", error.message || "Failed to create user");
				}
			},
		},
	});

	const handleEditUser = (user: UserSchema) => {
		setSelectedUser(user);
		setIsEditMode(true);
	};

	const handleCreateUser = () => {
		setIsCreateMode(true);
	};

	const handleUpdateUser = async (userData: Partial<UserSchema>) => {
		if (selectedUser) {
			await updateMutation.mutateAsync({
				params: { user_id: selectedUser.id },
				data: userData,
			});
		}
	};

	const handleCreateUserMutation = async (userData: RegisterUserData) => {
		await createMutation.mutateAsync({
			data: userData,
		});
	};

	// Мутация для удаления пользователя
	const deleteMutation = useDeleteUser({
		mutation: {
			onSuccess: () => {
				if (Platform.OS === "web") {
					window.alert("Success, User deleted successfully");
				} else {
					Alert.alert("Success", "User deleted successfully");
				}
				refetch(); // Обновляем список после удаления
			},
			onError: error => {
				if (Platform.OS === "web") {
					window.alert("Error: " + error.message || "Failed to delete user");
				} else {
					Alert.alert("Error", error.message || "Failed to delete user");
				}
			},
		},
	});

	const handleDeleteUser = async (user_id: number) => {
		if (Platform.OS === "web") {
			const response: boolean = window.confirm("Confirm Delete");

			if (response) {
				console.log("Deleting user: " + user_id);
				await deleteMutation.mutateAsync({ params: { user_id } });
			}
		} else {
			Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						console.log("Deleting user: " + user_id);
						await deleteMutation.mutateAsync({ params: { user_id } });
					},
				},
			]);
		}
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<View style={styles.container}>
			<Modal
				visible={isEditMode}
				transparent={true}
				animationType="fade"
				onRequestClose={() => {
					setIsEditMode(false);
					setSelectedUser(null);
				}}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						{selectedUser && (
							<EditUserForm
								user={selectedUser}
								onClose={() => {
									setIsEditMode(false);
									setSelectedUser(null);
								}}
								onSubmit={handleUpdateUser}
								isLoading={updateMutation.isPending}
							/>
						)}
					</View>
				</View>
			</Modal>

			<Modal
				visible={showInviteLinkModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowInviteLinkModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<GetInviteLinkForm
							inviteLink={inviteLink}
							onClose={() => setShowInviteLinkModal(false)}
						/>
					</View>
				</View>
			</Modal>

			<Modal
				visible={isCreateMode}
				transparent={true}
				animationType="fade"
				onRequestClose={() => {
					setIsCreateMode(false);
				}}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<CreateUserForm
							onSubmit={handleCreateUserMutation}
							onClose={() => {
								setIsCreateMode(false);
							}}
							isLoading={updateMutation.isPending}
						/>
					</View>
				</View>
			</Modal>

			<ScrollView style={styles.container}>
				<Card size="large" style={styles.card}>
					<Typography variant="h4" style={styles.title}>
						Users Management
					</Typography>

					<Button
						variant="contained"
						onPress={() => {
							handleCreateUser();
						}}
						style={styles.addButton}
					>
						Add New User
					</Button>

					{users?.map(user => (
						<Card
							key={user.id}
							size="small"
							variant={"outlined"}
							style={styles.userCard}
						>
							<View style={styles.userInfo}>
								<Typography variant="subtitle1">{user.nickname}</Typography>
								<Typography variant="body2">Id: {user.id}</Typography>
								<Typography variant="body2">Role: {user.role}</Typography>
								<Typography variant="body2">Status: {user.status}</Typography>
								<Typography variant="body2">Full name: {user.full_name}</Typography>
								<Typography variant="body2">
									Created at: {user.created_at}
								</Typography>
								<Typography variant="body2">
									Admin`s note: {user.admin_note}
								</Typography>
							</View>

							<View style={styles.actions}>
								<Button
									variant="outlined"
									onPress={() => {
										console.log("isEditedMode: " + isEditMode);
										handleEditUser(user);
										console.log("selected user: " + selectedUser);
									}}
								>
									Edit
								</Button>
								<Button variant="tint" onPress={() => handleDeleteUser(user.id)}>
									Delete
								</Button>
							</View>
						</Card>
					))}
				</Card>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing(2),
	},
	modalContent: {
		width: "100%",
		maxWidth: 600,
		// Не добавляем backgroundColor, так как Card уже имеет свой фон
	},

	card: {
		margin: theme.spacing(2),
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	addButton: {
		marginBottom: theme.spacing(3),
	},
	userCard: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	userInfo: {
		marginBottom: theme.spacing(2),
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(1),
	},
}));
