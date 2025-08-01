// src/hooks/useAdminMutations.ts
import { createMutationHandlersFactory } from "@/core/utils/mutationHandlers";
import { useLocationMutation } from "@/core/hooks/mutations/useLocationMutation";
import useRoomMutation from "@/core/hooks/mutations/useRoomMutation";
import useTaskMutation from "@/core/hooks/mutations/useTaskMutation";
import useRoomTaskMutation from "@/core/hooks/mutations/useRoomTaskMutation";
import useDailyAssignmentMutation from "@/core/hooks/mutations/useDailyAssignmentMutation";

export function useAdminMutations(modal: {
	modals: Record<string, boolean>;
	openModal: (modalName: string | number) => void;
	closeModal: (modalName: string | number) => void;
}) {
	const createMutationHandlers = createMutationHandlersFactory(modal);
	// Теперь используем эту функцию для всех мутаций
	const locationMutationHandlers = createMutationHandlers("Location");

	const roomMutationHandlers = createMutationHandlers("Room");

	const taskMutationHandlers = createMutationHandlers("Task");

	const roomTaskMutationHandlers = createMutationHandlers("RoomTask");

	const dailyAssignmentMutationHandlers = createMutationHandlers("Assignment");

	// Теперь инициализируем все хуки мутаций
	const locationMutation = useLocationMutation(locationMutationHandlers);
	const roomMutation = useRoomMutation(roomMutationHandlers);
	const taskMutation = useTaskMutation(taskMutationHandlers);
	const roomTaskMutation = useRoomTaskMutation(roomTaskMutationHandlers);
	const dailyAssignmentMutation = useDailyAssignmentMutation(dailyAssignmentMutationHandlers);

	return {
		locationMutation,
		roomMutation,
		taskMutation,
		roomTaskMutation,
		dailyAssignmentMutation,
		// ... другие мутации
	};
}
