import { createGenericMutation } from "./createGenericMutation";
import {
	DeleteLocationParams,
	EditLocationParams,
	getGetLocationsQueryKey,
	LocationCreate,
	LocationUpdate,
	useCreateLocation,
	useDeleteLocation,
	useEditLocation,
} from "@/api/admin";
import { useQueryClient } from "@tanstack/react-query";

export function useLocationMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete } = options;

	const queryClient = useQueryClient();
	const createLocationMutation = useCreateLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location created",
			onSuccess: onSuccessCreate,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetLocationsQueryKey() }),
		})
	);

	const updateLocationMutation = useEditLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location updated",
			onSuccess: onSuccessUpdate,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetLocationsQueryKey() }),
		})
	);

	const deleteLocationMutation = useDeleteLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location deleted",
			onSuccess: onSuccessDelete,
			invalidateQuery: () =>
				queryClient.invalidateQueries({ queryKey: getGetLocationsQueryKey() }),
		})
	);

	const handleCreateLocation = async (data: LocationCreate) => {
		await createLocationMutation.mutateAsync({ data });
	};

	const handleUpdateLocation = async (location_id: EditLocationParams, data: LocationUpdate) => {
		await updateLocationMutation.mutateAsync({ data, params: location_id });
	};

	const handleDeleteLocation = async (location_id: DeleteLocationParams) => {
		await deleteLocationMutation.mutateAsync({ params: location_id });
	};

	return {
		handleCreateLocation,
		handleUpdateLocation,
		handleDeleteLocation,
		createLocationMutation,
		updateLocationMutation,
		deleteLocationMutation,
	};
}
