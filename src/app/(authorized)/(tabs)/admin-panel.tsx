// src/pages/AdminPanelPage.tsx
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Loading, ModalContainer } from "@/ui";
import { useState } from "react";

import { RegisterUserData, useGetUsers, UserSchema } from "@/api/admin";
import EditUserForm from "@/ui/formComponents/EditUserForm";
import CreateUserForm from "@/ui/formComponents/CreateUserForm";
import UsersList from "@/ui/components/admin/UsersList";
import { useAdminMutations } from "@/hooks/useAdminMutations";
import { FontAwesome5 } from "@expo/vector-icons";
import GetLinkForm from "@/ui/formComponents/GetInviteLinkForm";

export default function AdminPanelPage() {
	const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);
	const [inviteLink, setInviteLink] = useState("");
	const [resetLink, setResetLink] = useState("");

	const [modalState, setModalState] = useState({
		editMode: false,
		createMode: false,
		inviteLinkModal: false,
		resetLinkModal: false,
	});
	// Получаем список пользователей
	const { data: users, isLoading, refetch } = useGetUsers({});

	const {
		handleUpdateUser,
		handleCreateUser,
		handleDeleteUser,
		handleForgetPassword,
		updateMutation,
		createMutation,
	} = useAdminMutations({
		onSuccessCreate: invite_link => {
			setInviteLink(invite_link);
			setModalState(prev => ({ ...prev, inviteLinkModal: true }));
			setModalState(prev => ({ ...prev, createMode: false }));
		},
		onSuccessUpdate: () => {
			setModalState(prev => ({ ...prev, editMode: false }));
			setSelectedUser(null);
		},
		onSuccessResetPassword: reset_link => {
			setResetLink(reset_link);
			setModalState(prevState => ({ ...prevState, resetLinkModal: true }));
		},
		refetch,
	});

	const handleEditUser = (user: UserSchema) => {
		setSelectedUser(user);
		setModalState(prev => ({ ...prev, editMode: true }));
	};

	const handleCreateUserClick = () => {
		setModalState(prev => ({ ...prev, createMode: true }));
	};

	const handleForgetPasswordClick = async (user_id: number) => {
		await handleForgetPassword(user_id);
		setModalState(prev => ({ ...prev, resetLinkModal: true }));
	};

	const handleUpdateUserSubmit = async (userData: Partial<UserSchema>) => {
		if (selectedUser) {
			await handleUpdateUser(selectedUser, userData);
		}
	};

	const handleCreateUserSubmit = async (userData: RegisterUserData) => {
		await handleCreateUser(userData);
	};

	const handleRefetchUsers = async () => {
		console.log("Refetching users...");
		await refetch();
	};

	if (isLoading) {
		return <Loading />;
	}

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.buttonsContainer}>
					<Button
						variant="contained"
						style={{ marginHorizontal: 10 }}
						onPress={handleCreateUserClick}
					>
						<FontAwesome5 name="user-plus" size={20} style={styles.addUserIcon} />
					</Button>
					<Button
						variant="outlined"
						style={{ marginHorizontal: 10 }}
						onPress={() => setModalState(prev => ({ ...prev, inviteLinkModal: true }))}
					>
						<FontAwesome5 name="link" size={20} style={styles.icon} />
					</Button>
					<Button
						variant={"outlined"}
						onPress={handleRefetchUsers}
						loading={isLoading}
						style={{ marginHorizontal: 10 }}
					>
						<FontAwesome5 name="sync" size={20} style={styles.icon} />
					</Button>
				</View>
				<UsersList
					users={users || []}
					onEditUser={handleEditUser}
					onDeleteUser={handleDeleteUser}
					onForgetPassword={handleForgetPasswordClick}
				/>
			</ScrollView>

			{/* Edit User Modal */}
			<ModalContainer
				visible={modalState.editMode}
				onClose={() => setModalState(prev => ({ ...prev, editMode: false }))}
			>
				{selectedUser && (
					<EditUserForm
						user={selectedUser}
						onSubmit={handleUpdateUserSubmit}
						onClose={() => setModalState(prev => ({ ...prev, editMode: false }))}
						isLoading={updateMutation.isPending}
					/>
				)}
			</ModalContainer>

			{/* Create User Modal */}
			<ModalContainer
				visible={modalState.createMode}
				onClose={() => setModalState(prev => ({ ...prev, createMode: false }))}
			>
				<CreateUserForm
					onSubmit={handleCreateUserSubmit}
					onClose={() => setModalState(prev => ({ ...prev, createMode: false }))}
					isLoading={createMutation.isPending}
				/>
			</ModalContainer>

			{/* Reset Link Modal */}
			<ModalContainer
				visible={modalState.resetLinkModal}
				onClose={() => setModalState(prev => ({ ...prev, resetLinkModal: false }))}
			>
				<GetLinkForm
					linkName={"Reset"}
					link={resetLink}
					onClose={() => setModalState(prev => ({ ...prev, resetLinkModal: false }))}
				/>
			</ModalContainer>

			{/* Invite Link Modal */}
			<ModalContainer
				visible={modalState.inviteLinkModal}
				onClose={() => setModalState(prev => ({ ...prev, inviteLinkModal: false }))}
			>
				<GetLinkForm
					linkName={"Invite"}
					link={inviteLink}
					onClose={() => setModalState(prev => ({ ...prev, inviteLinkModal: false }))}
				/>
			</ModalContainer>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		padding: theme.spacing(3),
	},
	scrollContent: {
		paddingBottom: theme.spacing(5),
	},
	buttonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap", // Важно: разрешаем перенос элементов
		justifyContent: "flex-end",
		marginBottom: theme.spacing(2),
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: theme.spacing(4),
	},
	icon: {
		color: theme.colors.primary.main,
	},
	addUserIcon: {
		color: theme.colors.background.main,
	},
	heading: {
		marginBottom: theme.spacing(2),
		flexDirection: "row",
		justifyContent: "center",
	},
}));
