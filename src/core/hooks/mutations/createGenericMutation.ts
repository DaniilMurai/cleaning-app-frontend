import { AlertUtils } from "@/core/utils/alerts";

type MutationOptions<T> = {
	mutation?: any;
	entityName: string;
	onSuccess?: (data?: T) => void;
	refetch?: () => void;
	invalidateQuery?: () => void;
};

export function createGenericMutation<T>({
	mutation,
	entityName,
	onSuccess,
	refetch,
	invalidateQuery,
}: MutationOptions<T>) {
	return {
		mutation: {
			onSuccess: (data?: T) => {
				AlertUtils.showSuccess(`${entityName} successfully`);
				onSuccess?.(data);
				invalidateQuery && invalidateQuery();
				refetch && refetch();
			},
			onError: (error: Error) => {
				AlertUtils.showError(error.message || `Failed to ${entityName.toLowerCase()}`);
			},
		},
	};
}
