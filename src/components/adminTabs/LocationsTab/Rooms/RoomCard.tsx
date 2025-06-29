import { Dialog } from "@/ui";
import React, { useState } from "react";
import { LocationResponse, RoomResponse, RoomTaskResponse, TaskResponse } from "@/api/admin";
import { DeleteRoomConfirm, EditRoomForm } from "@/ui/forms/common/RoomForms";
import TasksListDialog from "@/components/lists/TasksListDialog";
import RoomCardHeader from "@/components/adminTabs/LocationsTab/Rooms/RoomCardHeader";

export interface RoomCardProps {
	room: RoomResponse;
	rooms: RoomResponse[];
	locations: LocationResponse[];
	tasks: TaskResponse[];
	roomTasks: RoomTaskResponse[];
	roomMutation: any;
	roomTaskMutation: any;
	roomTasksRefetch: any;
	tasksRefetch: any;
}

export default function RoomCard({
	room,
	rooms,
	locations,
	tasks,
	roomTasks,
	roomMutation,
	roomTaskMutation,
	roomTasksRefetch,
	tasksRefetch,
}: RoomCardProps) {
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showCreateRoomTask, setShowCreateRoomTask] = useState(false);

	const handleUnlinkTask = async (taskId: number) => {
		const roomTask = roomTasks.find(rt => rt.room_id === room.id && rt.task_id === taskId);

		if (roomTask) {
			await roomTaskMutation.handleDeleteRoomTask({
				room_task_id: roomTask.id,
			});
			roomTasksRefetch();
		}
	};

	return (
		<>
			<RoomCardHeader
				room={room}
				tasks={tasks}
				roomTasks={roomTasks}
				onEdit={() => setShowEdit(true)}
				onDelete={() => setShowDelete(true)}
				onAddTask={() => setShowCreateRoomTask(true)}
				onUnlinkTask={handleUnlinkTask}
			/>

			<Dialog visible={showEdit} onClose={() => setShowEdit(false)}>
				<EditRoomForm
					onSubmit={roomMutation.handleUpdateRoom}
					onClose={() => setShowEdit(false)}
					room={room}
					isLoading={roomMutation.updateRoomMutation.isPending}
				/>
			</Dialog>

			<Dialog visible={showDelete} onClose={() => setShowDelete(false)}>
				<DeleteRoomConfirm
					room={room}
					onConfirm={roomMutation.handleDeleteRoom}
					onClose={() => setShowDelete(false)}
					isLoading={roomMutation.deleteRoomMutation.isPending}
				/>
			</Dialog>

			<TasksListDialog
				visible={showCreateRoomTask}
				onClose={() => setShowCreateRoomTask(false)}
				tasks={tasks}
				rooms={rooms}
				room={room}
				locations={locations}
				roomTasks={roomTasks}
				tasksRefetch={tasksRefetch}
				roomTasksRefetch={roomTasksRefetch}
			/>
		</>
	);
}
