import { AlertUtils } from "@/core/utils/alerts";
import { useQueryClient } from "@tanstack/react-query";
import {
	DeleteHintParams,
	getGetTasksWithHintsQueryKey,
	HintsCreate,
	HintsUpdate,
	UpdateHintParams,
	useCreateHint,
	useDeleteHint,
	useUpdateHint,
} from "@/api/admin";

export default function useHintMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();

	const createHintMutation = useCreateHint({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Hint created successfully");
				onSuccessCreate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to create hint");
			},
		},
	});

	const updateHintMutation = useUpdateHint({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Hint updated successfully");
				onSuccessUpdate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update hint");
			},
		},
	});

	const deleteHintMutation = useDeleteHint({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Hint deleted successfully");
				onSuccessDelete?.();
				onSuccessUpdate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to delete hint");
			},
		},
	});

	const handleCreateHint = async (data: HintsCreate) => {
		await createHintMutation.mutateAsync({ data });
	};

	const handleUpdateHint = async (hint_id: UpdateHintParams, data: HintsUpdate) => {
		await updateHintMutation.mutateAsync({ params: hint_id, data });
	};

	const handleDeleteHint = async (hint_id: DeleteHintParams) => {
		AlertUtils.showConfirm(
			"Confirm Delete",
			"Are you sure you want to delete this hint?",
			async () => {
				console.log("Deleting hint: " + hint_id);
				return await deleteHintMutation.mutateAsync({ params: hint_id });
			}
		);
	};

	return {
		handleCreateHint,
		handleUpdateHint,
		handleDeleteHint,
		createHintMutation,
		updateHintMutation,
		deleteHintMutation,
	};
}
