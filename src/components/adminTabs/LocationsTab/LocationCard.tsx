import { TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "../../../ui/common/Typography";
import { Button, Card, ModalContainer } from "@/ui";
import Collapse from "../../../ui/common/Collapse";
import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native-unistyles";
import { LocationResponse } from "@/api/admin";
import { DeleteLocationConfirm, EditLocationForm } from "@/ui/forms/common/LocationForms";
import { useTranslation } from "react-i18next";
import RoomCard, { RoomCardProps } from "@/components/adminTabs/LocationsTab/Rooms/RoomCard";
import { CreateRoomForm } from "@/ui/forms/common/RoomForms";

interface LocationCardProps extends Omit<RoomCardProps, "room"> {
	location: LocationResponse;
	locationMutation: any;
}

export default function LocationCard({ location, locationMutation, ...props }: LocationCardProps) {
	const { rooms, roomMutation } = props;

	const { t } = useTranslation();

	const [expanded, setExpanded] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showCreateRoom, setShowCreateRoom] = useState(false);

	const locationRooms = useMemo(
		() => rooms.filter(room => room.location_id === location.id),
		[rooms, location.id]
	);

	return (
		<>
			<Card key={location.id} style={styles.card}>
				<TouchableOpacity
					style={styles.cardHeader}
					onPress={() => setExpanded(prev => !prev)}
				>
					<View style={styles.headerWithIcon}>
						<FontAwesome5
							name={expanded ? "angle-down" : "angle-right"}
							size={16}
							color={styles.collapseIcon.color}
						/>
						<Typography variant="h5">{location.name}</Typography>
					</View>
					<View style={styles.actionButtons}>
						<Button
							variant="outlined"
							onPress={() => {
								setShowEdit(true);
							}}
						>
							<FontAwesome5 name="edit" size={14} />
						</Button>
						<Button
							variant="outlined"
							style={styles.deleteButton}
							onPress={() => {
								setShowDelete(true);
							}}
						>
							<FontAwesome5 name="trash" size={14} />
						</Button>
					</View>
				</TouchableOpacity>

				<Collapse expanded={expanded}>
					<Typography>{location.address}</Typography>

					<View style={styles.divider} />
					<Typography variant="subtitle1">{t("admin.rooms")}</Typography>

					{!locationRooms.length ? (
						<Typography style={styles.emptyState}> {t("admin.noRooms")}</Typography>
					) : (
						locationRooms.map(room => <RoomCard key={room.id} room={room} {...props} />)
					)}

					<Button
						variant="outlined"
						style={styles.addButton}
						onPress={() => {
							setShowCreateRoom(true);
						}}
					>
						<FontAwesome5 name="plus" size={14} /> {t("admin.addRoom")}
					</Button>
				</Collapse>
			</Card>

			<ModalContainer visible={showEdit} onClose={() => setShowEdit(false)}>
				<EditLocationForm
					location={location}
					onSubmit={locationMutation.handleUpdateLocation}
					onClose={() => setShowEdit(false)}
					isLoading={locationMutation.updateLocationMutation.isPending}
				/>
			</ModalContainer>

			<ModalContainer visible={showDelete} onClose={() => setShowDelete(false)}>
				<DeleteLocationConfirm
					location={location}
					onConfirm={locationMutation.handleDeleteLocation}
					onClose={() => setShowDelete(false)}
					isLoading={locationMutation.deleteLocationMutation.isPending}
				/>
			</ModalContainer>
			<ModalContainer visible={showCreateRoom} onClose={() => setShowCreateRoom(false)}>
				<CreateRoomForm
					onSubmit={roomMutation.handleCreateRoom}
					onClose={() => setShowCreateRoom(false)}
					location_id={location.id}
					isLoading={roomMutation.createRoomMutation.isPending}
				/>
			</ModalContainer>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	card: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		alignItems: "center",
		marginBottom: theme.spacing(1),
	},
	headerWithIcon: {
		flexDirection: "row",
		flex: 1,
		alignItems: "center",
		gap: theme.spacing(1),
	},
	collapseIcon: {
		color: theme.colors.text.primary,
	},
	actionButtons: {
		flexDirection: "row",
		gap: theme.spacing(1),
	},
	deleteButton: {
		borderColor: theme.colors.error.main,
		color: theme.colors.error.main,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.divider,
		marginVertical: theme.spacing(2),
	},
	addButton: {
		marginTop: theme.spacing(1),
		alignSelf: "flex-start",
	},
	emptyState: {
		fontStyle: "italic",
		color: theme.colors.text.secondary,
		marginVertical: theme.spacing(1),
	},
}));
