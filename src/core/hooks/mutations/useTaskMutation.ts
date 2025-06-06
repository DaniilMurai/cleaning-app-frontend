import {
	DeleteTaskParams,
	EditTaskParams,
	TaskCreate,
	TaskUpdate,
	useCreateTask,
	useDeleteTask,
	useEditTask,
} from "@/api/admin";
import { AlertUtils } from "@/core/utils/alerts";

export default function useTaskMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createTaskMutation = useCreateTask({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("Task created successfully");
				onSuccessCreate?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to create task");
			},
		},
	});

	const updateTaskMutation = useEditTask({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("Task updated successfully");
				onSuccessUpdate?.();
				refetch();
			},
			onError: error => {
				AlertUtils.showError(error.message || "Failed to update task");
			},
		},
	});

	const deleteTaskMutation = useDeleteTask({
		mutation: {
			onSuccess: () => {
				AlertUtils.showSuccess("Task deleted successfully");
				onSuccessDelete?.();
				refetch();
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
