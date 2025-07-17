// src/utils/mutationHandlers.ts

import useModals from "@/core/hooks/shared/useModals";

/**
 * Creates a factory for mutation handlers
 * @param modal - Modal controller from useModals hook
 * @returns A function that creates standard mutation handlers for entity operations
 */
export const createMutationHandlersFactory = (modal: ReturnType<typeof useModals>) => {
	/**
	 * Creates standard mutation handlers for entity operations
	 * @param entityName - Name of the entity to be used in modal names
	 * @param options - Configuration options
	 * @returns Object with onSuccess handlers for create, update, and delete operations
	 */
	return (entityName: string, { closeModalOnSuccess = true } = {}) => ({
		onSuccessCreate: () => {
			if (closeModalOnSuccess) modal.closeModal(`create${entityName}`);
		},
		onSuccessUpdate: () => {
			if (closeModalOnSuccess) modal.closeModal(`edit${entityName}`);
		},
		onSuccessDelete: () => {
			if (closeModalOnSuccess) {
				console.log("closing default modal");
				modal.closeModal(`delete${entityName}`);
			}
		},
		onSuccessDeleteGroup: () => {
			if (closeModalOnSuccess) {
				console.log("closing modal group");
				modal.closeModal(`delete${entityName}Group`);
			}
		},
	});
};
