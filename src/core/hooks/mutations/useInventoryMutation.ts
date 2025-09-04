import { AlertUtils } from "@/core/utils/alerts";
import { useQueryClient } from "@tanstack/react-query";
import {
	DeleteInventoryParams,
	getGetTasksWithHintsQueryKey,
	InventoryCreate,
	InventoryUpdate,
	UpdateInventoryParams,
	useCreateInventory,
	useDeleteInventory,
	useUpdateInventory,
} from "@/api/admin";

export default function useInventoryMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();

	const createInventoryMutation = useCreateInventory({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Inventory created successfully");
				onSuccessCreate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to create inventory");
			},
		},
	});

	const updateInventoryMutation = useUpdateInventory({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Inventory updated successfully");
				onSuccessUpdate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update inventory");
			},
		},
	});

	const deleteInventoryMutation = useDeleteInventory({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Inventory deleted successfully");
				onSuccessDelete?.();
				onSuccessUpdate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksWithHintsQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to delete inventory");
			},
		},
	});

	const handleCreateInventory = async (data: InventoryCreate) => {
		await createInventoryMutation.mutateAsync({ data });
	};

	const handleUpdateInventory = async (
		inventory_id: UpdateInventoryParams,
		data: InventoryUpdate
	) => {
		await updateInventoryMutation.mutateAsync({ params: inventory_id, data });
	};

	const handleDeleteInventory = async (inventory_id: DeleteInventoryParams) => {
		AlertUtils.showConfirm(
			"Confirm Delete",
			"Are you sure you want to delete this inventory?",
			async () => {
				console.log("Deleting inventory: " + inventory_id);
				return await deleteInventoryMutation.mutateAsync({ params: inventory_id });
			}
		);
	};

	return {
		handleCreateInventory,
		handleUpdateInventory,
		handleDeleteInventory,
		createInventoryMutation,
		updateInventoryMutation,
		deleteInventoryMutation,
	};
}
