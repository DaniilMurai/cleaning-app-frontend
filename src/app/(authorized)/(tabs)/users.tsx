// src/pages/AdminPanelPage.tsx
import { ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button, Loading, ModalContainer } from "@/ui";
import { useState } from "react";

import { RegisterUserData, useGetUsers, UserSchema } from "@/api/admin";
import EditUserForm from "@/ui/forms/user/EditUserForm";
import CreateUserForm from "@/ui/forms/user/CreateUserForm";
import UsersList from "@/ui/components/lists/UsersList";
import { useAdminUsersMutations } from "@/core/hooks/mutations/useAdminUsersMutations";
import { FontAwesome5 } from "@expo/vector-icons";
import GetLinkForm from "@/ui/forms/common/GetInviteLinkForm";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
	const { t } = useTranslation();

	const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);
	const [inviteLink, setInviteLink] = useState("");
	const [resetLink, setResetLink] = useState("");

	const [manyColumns, setManyColumns] = useState<boolean>(false);

	const [modalState, setModalState] = useState({
		editMode: false,
		createMode: false,
		inviteLinkModal: false,
		resetLinkModal: false,
	});

	const { data: users, isLoading, isFetching, refetch } = useGetUsers({});

	const {
		handleUpdateUser,
		handleCreateUser,
		handleDeleteUser,
		handleForgetPassword,
		handleGetInviteLink,
		updateMutation,
		createMutation,
	} = useAdminUsersMutations({
		onSuccessCreate: invite_link => {
			setInviteLink(invite_link);
			setModalState(prev => ({ ...prev, inviteLinkModal: true, createMode: false }));
		},
		onSuccessUpdate: () => {
			setModalState(prev => ({ ...prev, editMode: false }));
			setSelectedUser(null);
		},
		onSuccessResetPassword: reset_link => {
			setResetLink(reset_link);
			setModalState(prev => ({ ...prev, resetLinkModal: true }));
		},
		onSuccessGetInviteLink: inviteLink => {
			setInviteLink(inviteLink);
			setModalState(prev => ({ ...prev, inviteLinkModal: true }));
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
	};

	const handleGetInviteLinkClick = async (user_id: number) => {
		await handleGetInviteLink(user_id);
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
						variant="outlined"
						style={{ marginHorizontal: 10 }}
						onPress={handleRefetchUsers}
						loading={isFetching}
					>
						<FontAwesome5 name="sync" size={20} style={styles.icon} />
					</Button>
					<Button
						variant={"outlined"}
						style={{ marginHorizontal: 10 }}
						onPress={() => setManyColumns(!manyColumns)}
					>
						<FontAwesome5 name={manyColumns ? "list" : "th"} size={24} />
					</Button>
					<Button
						variant="contained"
						style={{ marginHorizontal: 10 }}
						onPress={handleCreateUserClick}
					>
						<FontAwesome5 name="user-plus" size={20} style={styles.addUserIcon} />
					</Button>
				</View>
				<UsersList
					users={users || []}
					onEditUser={handleEditUser}
					onDeleteUser={handleDeleteUser}
					onForgetPassword={handleForgetPasswordClick}
					onActivateUser={handleGetInviteLinkClick}
					manyColumns={manyColumns}
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
					linkName={t("admin.resetLink")}
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
					linkName={t("admin.inviteLink")}
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
	},
	scrollContent: {
		padding: theme.spacing(2),
		paddingBottom: theme.spacing(5),
	},
	buttonsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "flex-end",
		marginBottom: theme.spacing(2),
	},
	icon: {
		color: theme.colors.primary.main,
	},
	addUserIcon: {
		color: theme.colors.background.main,
	},
}));
