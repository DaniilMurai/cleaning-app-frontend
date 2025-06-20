import {
	DailyAssignmentCreate,
	DailyAssignmentUpdate,
	DeleteDailyAssignmentParams,
	EditDailyAssignmentParams,
	useCreateDailyAssignment,
	useCreateDailyAssignmentsBatch,
	useDeleteDailyAssignment,
	useEditDailyAssignment,
} from "@/api/admin";
import { createGenericMutation } from "@/core/hooks/mutations/createGenericMutation";

export default function useDailyAssignmentMutation(options: {
	onSuccessCreate?: () => void;
	onSuccessUpdate?: () => void;
	onSuccessDelete?: () => void;
	refetch: () => void;
}) {
	const { onSuccessCreate, onSuccessUpdate, onSuccessDelete, refetch } = options;

	const createDailyAssignmentMutation = useCreateDailyAssignment(
		createGenericMutation({
			mutation: {},
			entityName: "Daily Assignment created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);

	const createDailyAssignmentsBatchMutation = useCreateDailyAssignmentsBatch(
		createGenericMutation({
			mutation: {},
			entityName: "Daily Assignments created",
			onSuccess: onSuccessCreate,
			refetch,
		})
	);

	const updateDailyAssignmentMutation = useEditDailyAssignment(
		createGenericMutation({
			mutation: {},
			entityName: "Daily Assignment updated",
			onSuccess: onSuccessUpdate,
			refetch,
		})
	);
	const deleteDailyAssignmentMutation = useDeleteDailyAssignment(
		createGenericMutation({
			mutation: {},
			entityName: "Daily Assignment deleted",
			onSuccess: onSuccessDelete,
			refetch,
		})
	);

	const handleCreateDailyAssignment = async (data: DailyAssignmentCreate) => {
		await createDailyAssignmentMutation.mutateAsync({ data });
	};

	const handleCreateDailyAssignmentsBatch = async (data: DailyAssignmentCreate[]) => {
		await createDailyAssignmentsBatchMutation.mutateAsync({ data });
	};
	const handleUpdateDailyAssignment = async (
		daily_assignment_id: EditDailyAssignmentParams,
		data: DailyAssignmentUpdate
	) => {
		await updateDailyAssignmentMutation.mutateAsync({ data, params: daily_assignment_id });
	};

	const handleDeleteDailyAssignment = async (
		daily_assignment_id: DeleteDailyAssignmentParams
	) => {
		await deleteDailyAssignmentMutation.mutateAsync({ params: daily_assignment_id });
	};

	return {
		handleCreateDailyAssignmentsBatch,
		handleCreateDailyAssignment,
		handleUpdateDailyAssignment,
		handleDeleteDailyAssignment,
		createDailyAssignmentsBatchMutation,
		createDailyAssignmentMutation,
		updateDailyAssignmentMutation,
		deleteDailyAssignmentMutation,
	};
}
