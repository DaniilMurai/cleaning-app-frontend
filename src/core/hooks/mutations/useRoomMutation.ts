import {
	DeleteRoomParams,
	EditRoomParams,
	getGetRoomsQueryKey,
	RoomCreate,
	RoomUpdate,
	useCreateRoom,
	useDeleteRoom,
	useEditRoom,
} from "@/api/admin";
import { createGenericMutation } from "@/core/hooks/mutations/createGenericMutation";
import { useQueryClient } from "@tanstack/react-query";

export default function useRoomMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch?: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();

	const createRoomMutation = useCreateRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room created",
			onSuccess: onSuccessCreate,

			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() }),
		})
	);
	const updateRoomMutation = useEditRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room updated",
			onSuccess: onSuccessUpdate,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() }),
		})
	);

	const deleteRoomMutation = useDeleteRoom(
		createGenericMutation({
			mutation: {},
			entityName: "Room deleted",
			onSuccess: onSuccessDelete,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetRoomsQueryKey() }),
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
