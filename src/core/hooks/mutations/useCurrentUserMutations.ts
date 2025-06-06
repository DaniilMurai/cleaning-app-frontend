// src/hooks/useCurrentUserMutations.ts
import {
	UpdateUserData,
	useChangePassword,
	UserUpdatePassword,
	useUpdateCurrentUser,
} from "@/api/users";
import { AlertUtils } from "@/core/utils/alerts";

export function useCurrentUserMutations(options: {
	onSuccessUpdate?: () => void;
	onSuccessChangePassword?: () => void;
	refetch: () => void;
}) {
	const { onSuccessUpdate, onSuccessChangePassword, refetch } = options;

	const updateMutation = useUpdateCurrentUser({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("Profile updated successfully");
				onSuccessUpdate?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update profile");
			},
		},
	});

	const changePasswordMutation = useChangePassword({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("Password changed successfully");
				onSuccessChangePassword?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to change password");
			},
		},
	});

	const handleUpdateCurrentUser = async (userData: UpdateUserData) => {
		await updateMutation.mutateAsync({ data: userData });
	};

	const handleChangePassword = async (password: UserUpdatePassword) => {
		await changePasswordMutation.mutateAsync({ data: password });
	};

	return {
		handleUpdateCurrentUser,
		updateMutation,
		handleChangePassword,
		changePasswordMutation,
	};
}
