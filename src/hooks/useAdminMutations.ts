// src/hooks/useAdminMutations.ts
import { createMutationHandlersFactory } from "@/utils/mutationHandlers";
import { useLocationMutation } from "@/hooks/useLocationMutation";
import useRoomMutation from "@/hooks/useRoomMutation";
import useTaskMutation from "@/hooks/useTaskMutation";
import useRoomTaskMutation from "@/hooks/useRoomTaskMutation";
import useDailyAssignmentMutation from "@/hooks/useDailyAssignmentMutation";

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
