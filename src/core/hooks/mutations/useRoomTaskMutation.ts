import {
	DeleteRoomTaskParams,
	EditRoomTaskParams,
	getGetRoomTasksQueryKey,
	RoomTaskCreate,
	RoomTaskUpdate,
	useCreateRoomTask,
	useDeleteRoomTask,
	useEditRoomTask,
} from "@/api/admin";
import { createGenericMutation } from "@/core/hooks/mutations/createGenericMutation";
import { useQueryClient } from "@tanstack/react-query";

export default function useRoomTaskMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();

	const createRoomTaskMutation = useCreateRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask created",
			onSuccess: onSuccessCreate,
			// refetch,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomTasksQueryKey() }),
		})
	);
	const updateRoomTaskMutation = useEditRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask updated",
			onSuccess: onSuccessUpdate,
			// refetch,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomTasksQueryKey() }),
		})
	);

	const deleteRoomTaskMutation = useDeleteRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask deleted",
			onSuccess: onSuccessDelete,
			// refetch,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomTasksQueryKey() }),
		})
	);

	const handleCreateRoomTask = async (data: RoomTaskCreate) => {
		await createRoomTaskMutation.mutateAsync({ data });
	};

	const handleUpdateRoomTask = async (RoomTask_id: EditRoomTaskParams, data: RoomTaskUpdate) => {
		await updateRoomTaskMutation.mutateAsync({ data, params: RoomTask_id });
	};

	const handleDeleteRoomTask = async (RoomTask_id: DeleteRoomTaskParams) => {
		await deleteRoomTaskMutation.mutateAsync({ params: RoomTask_id });
	};

	return {
		handleCreateRoomTask,
		handleUpdateRoomTask,
		handleDeleteRoomTask,
		createRoomTaskMutation,
		updateRoomTaskMutation,
		deleteRoomTaskMutation,
	};
}
