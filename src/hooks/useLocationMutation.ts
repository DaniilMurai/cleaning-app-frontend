import { createGenericMutation } from "./createGenericMutation";
import {
	DeleteLocationParams,
	EditLocationParams,
	LocationCreate,
	useCreateLocation,
	useDeleteLocation,
	useEditLocation,
} from "@/api/admin";

export function useLocationMutation(options: {
	onSuccessCreate: () => void;
	onSuccessUpdate: () => void;
	onSuccessDelete: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createLocationMutation = useCreateLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);

	const updateLocationMutation = useEditLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location updated",
			onSuccess: onSuccessUpdate,
			refetch,
		})
	);

	const deleteLocationMutation = useDeleteLocation(
		createGenericMutation({
			mutation: {},
			entityName: "Location deleted",
			onSuccess: onSuccessDelete,
			refetch,
		})
	);

	const handleCreateLocation = async (data: LocationCreate) => {
		await createLocationMutation.mutateAsync({ data });
	};

	const handleUpdateLocation = async (location_id: EditLocationParams, data: LocationCreate) => {
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
