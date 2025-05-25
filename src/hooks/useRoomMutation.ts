import {
	DeleteRoomParams,
	EditRoomParams,
	RoomCreate,
	RoomUpdate,
	useCreateRoom,
	useDeleteRoom,
	useEditRoom,
} from "@/api/admin";
import { createGenericMutation } from "@/hooks/createGenericMutation";

export default function useRoomMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createRoomMutation = useCreateRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);
	const updateRoomMutation = useEditRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room updated",
			onSuccess: onSuccessUpdate,
			refetch,
		})
	);

	const deleteRoomMutation = useDeleteRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room deleted",
			onSuccess: onSuccessDelete,
			refetch,
		})
	);

	const handleCreateRoom = async (data: RoomCreate) => {
		await createRoomMutation.mutateAsync({ data });
	};

	const handleUpdateRoom = async (room_id: EditRoomParams, data: RoomUpdate) => {
		await updateRoomMutation.mutateAsync({ data, params: room_id });
	};

	const handleDeleteRoom = async (room_id: DeleteRoomParams) => {
		await deleteRoomMutation.mutateAsync({ params: room_id });
	};

	return {
		handleCreateRoom,
		handleUpdateRoom,
		handleDeleteRoom,
		createRoomMutation,
		updateRoomMutation,
		deleteRoomMutation,
	};
}
