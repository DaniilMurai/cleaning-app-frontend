// src/hooks/useAdminData.ts
import {
	useGetDailyAssignments,
	useGetLocations,
	useGetRooms,
	useGetRoomTasks,
	useGetTasks,
} from "@/api/admin";

export function useAdminData() {
	const {
		data: locations,
		isLoading: locationsIsLoading,
		refetch: locationsRefetch,
	} = useGetLocations({});

	const { data: rooms, isLoading: roomsIsLoading, refetch: roomsRefetch } = useGetRooms({});

	const { data: tasks, isLoading: tasksIsLoading, refetch: tasksRefetch } = useGetTasks({});

	const {
		data: roomTasks,
		isLoading: roomTasksIsLoading,
		refetch: roomTasksRefetch,
	} = useGetRoomTasks({});

	const { refetch: dailyAssignmentsRefetch } = useGetDailyAssignments({});

	// ... другие API хуки

	return {
		locations,
		locationsIsLoading,
		locationsRefetch,
		rooms,
		roomsIsLoading,
		roomsRefetch,
		tasks,
		tasksIsLoading,
		tasksRefetch,
		roomTasks,
		roomTasksIsLoading,
		roomTasksRefetch,
		dailyAssignmentsRefetch,

		// ... остальные возвращаемые данные
	};
}
