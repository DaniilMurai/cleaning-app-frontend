import { AlertUtils } from "@/utils/alerts";

type MutationOptions<T> = {
	mutation: any;
	entityName: string;
	onSuccess?: (data?: T) => void;
	refetch: () => void;
};

export function createGenericMutation<T>({
	mutation,
	entityName,
	onSuccess,
	refetch,
}: MutationOptions<T>) {
	return {
		mutation: {
			onSuccess: (data?: T) => {
				AlertUtils.showSuccess(`${entityName} successfully`);
				onSuccess?.(data);
				refetch();
			},
			onError: (error: Error) => {
				AlertUtils.showError(error.message || `Failed to ${entityName.toLowerCase()}`);
			},
		},
	};
}
