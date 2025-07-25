// src/pages/AdminPanelPage.tsx
import { ScrollView, useWindowDimensions, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button, Dialog, Loading } from "@/ui";
import React, { useState } from "react";

import { AdminReadUser, useGetUsers } from "@/api/admin";
import EditUserForm from "@/ui/forms/user/EditUserForm";
import CreateUserForm from "@/ui/forms/user/CreateUserForm";
import UsersList from "@/components/lists/UsersList";
import { useAdminUsersMutations } from "@/core/hooks/mutations/useAdminUsersMutations";
import { FontAwesome5 } from "@expo/vector-icons";
import GetLinkForm from "@/ui/forms/common/GetInviteLinkForm";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
	const { t } = useTranslation();

	const [selectedUser, setSelectedUser] = useState<AdminReadUser | null>(null);
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

	if (isLoading) {
		return <Loading />;
	}

	const ManyColumnButton = React.memo(() => {
		const { width } = useWindowDimensions();
		const { theme } = useUnistyles();

		width < theme.breakpoints.lg && setManyColumns(false);
		return (
			width >= theme.breakpoints.lg && (
				<Button
					variant={"outlined"}
					style={{ marginHorizontal: 10 }}
					onPress={() => setManyColumns(!manyColumns)}
				>
					<FontAwesome5 name={manyColumns ? "list" : "th"} size={24} />
				</Button>
			)
		);
	});

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.buttonsContainer}>
					<Button
						variant="outlined"
						style={{ marginHorizontal: 10 }}
						onPress={async () => await refetch()}
						loading={isFetching}
					>
						<FontAwesome5 name="sync" size={20} style={styles.icon} />
					</Button>

					<ManyColumnButton />

					<Button
						variant="contained"
						style={{ marginHorizontal: 10 }}
						onPress={() => setModalState(prev => ({ ...prev, createMode: true }))}
					>
						<FontAwesome5 name="user-plus" size={20} style={styles.addUserIcon} />
					</Button>
				</View>
				<UsersList
					users={users || []}
					onEditUser={user => {
						setSelectedUser(user);
						setModalState(prev => ({ ...prev, editMode: true }));
					}}
					onDeleteUser={handleDeleteUser}
					onForgetPassword={async userId => await handleForgetPassword(userId)}
					onActivateUser={async userId => await handleGetInviteLink(userId)}
					manyColumns={manyColumns}
				/>
			</ScrollView>

			{/* Edit User Modal */}
			<Dialog
				visible={modalState.editMode}
				onClose={() => setModalState(prev => ({ ...prev, editMode: false }))}
			>
				{selectedUser && (
					<EditUserForm
						user={selectedUser}
						onSubmit={async (userData: Partial<AdminReadUser>) => {
							if (selectedUser) {
								await handleUpdateUser(selectedUser, userData);
							}
						}}
						onClose={() => setModalState(prev => ({ ...prev, editMode: false }))}
						isLoading={updateMutation.isPending}
					/>
				)}
			</Dialog>

			{/* Create User Modal */}
			<Dialog
				visible={modalState.createMode}
				onClose={() => setModalState(prev => ({ ...prev, createMode: false }))}
			>
				<CreateUserForm
					onSubmit={async userData => await handleCreateUser(userData)}
					onClose={() => setModalState(prev => ({ ...prev, createMode: false }))}
					isLoading={createMutation.isPending}
				/>
			</Dialog>

			{/* Reset Link Modal */}
			<Dialog
				visible={modalState.resetLinkModal}
				onClose={() => setModalState(prev => ({ ...prev, resetLinkModal: false }))}
			>
				<GetLinkForm
					linkName={t("admin.resetLink")}
					link={resetLink}
					onClose={() => setModalState(prev => ({ ...prev, resetLinkModal: false }))}
				/>
			</Dialog>

			{/* Invite Link Modal */}
			<Dialog
				visible={modalState.inviteLinkModal}
				onClose={() => setModalState(prev => ({ ...prev, inviteLinkModal: false }))}
			>
				<GetLinkForm
					linkName={t("admin.inviteLink")}
					link={inviteLink}
					onClose={() => setModalState(prev => ({ ...prev, inviteLinkModal: false }))}
				/>
			</Dialog>
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
