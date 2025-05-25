import {
	DeleteRoomTaskParams,
	EditRoomTaskParams,
	RoomTaskCreate,
	RoomTaskUpdate,
	useCreateRoomTask,
	useDeleteRoomTask,
	useEditRoomTask,
} from "@/api/admin";
import { createGenericMutation } from "@/hooks/createGenericMutation";

export default function useRoomTaskMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createRoomTaskMutation = useCreateRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);
	const updateRoomTaskMutation = useEditRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask updated",
			onSuccess: onSuccessUpdate,
			refetch,
		})
	);

	const deleteRoomTaskMutation = useDeleteRoomTask(
		createGenericMutation({
			mutation: {},
			entityName: "RoomTask deleted",
			onSuccess: onSuccessDelete,
			refetch,
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
