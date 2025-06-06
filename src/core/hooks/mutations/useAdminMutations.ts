// src/hooks/useAdminMutations.ts
import { createMutationHandlersFactory } from "@/core/utils/mutationHandlers";
import { useLocationMutation } from "@/core/hooks/mutations/useLocationMutation";
import useRoomMutation from "@/core/hooks/mutations/useRoomMutation";
import useTaskMutation from "@/core/hooks/mutations/useTaskMutation";
import useRoomTaskMutation from "@/core/hooks/mutations/useRoomTaskMutation";
import useDailyAssignmentMutation from "@/core/hooks/mutations/useDailyAssignmentMutation";

export function useAdminMutations(
	modal: {
		modals: Record<string, boolean>;
		openModal: (modalName: string | number) => void;
		closeModal: (modalName: string | number) => void;
	},
	refetchFunctions: {
		locationsRefetch: any;
		roomsRefetch: any;
		tasksRefetch: any;
		roomTasksRefetch: any;
		dailyAssignmentsRefetch: any;
	}
) {
	const createMutationHandlers = createMutationHandlersFactory(modal);
	// Теперь используем эту функцию для всех мутаций
	const locationMutationHandlers = {
		...createMutationHandlers("Location"),
		refetch: refetchFunctions.locationsRefetch,
	};

	const roomMutationHandlers = {
		...createMutationHandlers("Room"),
		refetch: refetchFunctions.roomsRefetch,
	};

	const taskMutationHandlers = {
		...createMutationHandlers("Task"),
		refetch: refetchFunctions.tasksRefetch,
	};

	const roomTaskMutationHandlers = {
		...createMutationHandlers("RoomTask"),
		refetch: refetchFunctions.roomTasksRefetch,
	};

	const dailyAssignmentMutationHandlers = {
		...createMutationHandlers("Assignment"),
		refetch: refetchFunctions.dailyAssignmentsRefetch,
	};

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
