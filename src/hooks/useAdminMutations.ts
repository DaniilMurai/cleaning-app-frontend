// src/hooks/useAdminMutations.ts
import { RegisterUserData, useCreateUser, useDeleteUser, useUpdateUser } from "@/api/admin";
import { UserSchema } from "@/api/admin/schemas/userSchema";
import { AlertUtils } from "@/utils/alerts";

export function useAdminMutations(options: {
	onSuccessCreate?: (invite_link: string) => void;
	onSuccessUpdate?: () => void;
	onSuccessDelete?: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const updateMutation = useUpdateUser({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("User updated successfully");
				onSuccessUpdate?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update user");
			},
		},
	});

	const createMutation = useCreateUser({
		mutation: {
			onSuccess: data => {
				const invite_link = data.invite_link;
				onSuccessCreate?.(invite_link);
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to create user");
			},
		},
	});

	const deleteMutation = useDeleteUser({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("User deleted successfully");
				onSuccessDelete?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to delete user");
			},
		},
	});

	const handleUpdateUser = async (selectedUser: UserSchema, userData: Partial<UserSchema>) => {
		await updateMutation.mutateAsync({
			params: { user_id: selectedUser.id },
			data: userData,
		});
	};

	const handleCreateUser = async (userData: RegisterUserData) => {
		await createMutation.mutateAsync({ data: userData });
	};

	const handleDeleteUser = async (user_id: number) => {
		AlertUtils.showConfirm(
			"Confirm Delete",
			"Are you sure you want to delete this user?",
			async () => {
				console.log("Deleting user: " + user_id);
				await deleteMutation.mutateAsync({ params: { user_id } });
			}
		);
	};

	return {
		handleUpdateUser,
		handleCreateUser,
		handleDeleteUser,
		updateMutation,
		createMutation,
		deleteMutation,
	};
}
