import {
	DailyExtraTaskCreate,
	DailyExtraTaskUpdate,
	DeleteDailyExtraTaskParams,
	EditDailyExtraTaskParams,
	useCreateDailyExtraTask,
	useDeleteDailyExtraTask,
	useEditDailyExtraTask,
} from "@/api/admin";
import { createGenericMutation } from "@/hooks/createGenericMutation";

export default function useDailyExtraTaskMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createDailyExtraTaskMutation = useCreateDailyExtraTask(
		createGenericMutation({
			mutation: {},
			entityName: "Daily extra task created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);

	const updateDailyExtraTaskMutation = useEditDailyExtraTask(
		createGenericMutation({
			mutation: {},
			entityName: "Daily extra task updated",
			onSuccess: onSuccessUpdate,
			refetch,
		})
	);
	const deleteDailyExtraTaskMutation = useDeleteDailyExtraTask(
		createGenericMutation({
			mutation: {},
			entityName: "Daily extra task deleted",
			onSuccess: onSuccessDelete,
			refetch,
		})
	);

	const handleCreateDailyExtraTask = async (data: DailyExtraTaskCreate) => {
		await createDailyExtraTaskMutation.mutateAsync({ data });
	};

	const handleUpdateDailyExtraTask = async (
		daily_extra_task_id: EditDailyExtraTaskParams,
		data: DailyExtraTaskUpdate
	) => {
		await updateDailyExtraTaskMutation.mutateAsync({ data, params: daily_extra_task_id });
	};

	const handleDeleteDailyExtraTask = async (daily_extra_task_id: DeleteDailyExtraTaskParams) => {
		await deleteDailyExtraTaskMutation.mutateAsync({ params: daily_extra_task_id });
	};

	return {
		handleCreateDailyExtraTask,
		handleUpdateDailyExtraTask,
		handleDeleteDailyExtraTask,
		createDailyExtraTaskMutation,
		updateDailyExtraTaskMutation,
		deleteDailyExtraTaskMutation,
	};
}
