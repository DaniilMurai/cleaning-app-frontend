import {
	DeleteTaskParams,
	EditTaskParams,
	getGetTasksQueryKey,
	TaskCreate,
	TaskUpdate,
	useCreateTask,
	useDeleteTask,
	useEditTask,
} from "@/api/admin";
import { AlertUtils } from "@/core/utils/alerts";
import { useQueryClient } from "@tanstack/react-query";

export default function useTaskMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();

	const createTaskMutation = useCreateTask({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Task created successfully");
				onSuccessCreate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to create task");
			},
		},
	});

	const updateTaskMutation = useEditTask({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Task updated successfully");
				onSuccessUpdate?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update task");
			},
		},
	});

	const deleteTaskMutation = useDeleteTask({
		mutation: {
			onSuccess: async () => {
				AlertUtils.showSuccess("Task deleted successfully");
				onSuccessDelete?.();
				// refetch();
				await queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to delete task");
			},
		},
	});

	const handleCreateTask = async (data: TaskCreate) => {
		await createTaskMutation.mutateAsync({ data });
	};

	const handleUpdateTask = async (task_id: EditTaskParams, data: TaskUpdate) => {
		await updateTaskMutation.mutateAsync({ params: task_id, data });
	};

	const handleDeleteTask = async (task_id: DeleteTaskParams) => {
		await deleteTaskMutation.mutateAsync({ params: task_id });
	};

	return {
		handleCreateTask,
		handleUpdateTask,
		handleDeleteTask,
		createTaskMutation,
		updateTaskMutation,
		deleteTaskMutation,
	};
}
