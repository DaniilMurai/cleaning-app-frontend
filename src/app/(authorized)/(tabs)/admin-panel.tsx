import { Alert, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { Button } from "@/ui";

import { useState } from "react";
import { UserSchema } from "@/api/admin/schemas/userSchema";
import { useDeleteUser, useGetUsers } from "@/api/admin";

export default function AdminPanelPage() {
	const [selectedUser, setSelectedUser] = useState<UserSchema | null>(null);

	// Получаем список пользователей
	const { data: users, isLoading, refetch } = useGetUsers({});

	// Мутация для удаления пользователя
	const deleteMutation = useDeleteUser({
		mutation: {
			onSuccess: () => {
				Alert.alert("Success", "User deleted successfully");
				refetch(); // Обновляем список после удаления
			},
			onError: error => {
				Alert.alert("Error", error.message || "Failed to delete user");
			},
		},
	});

	const handleDeleteUser = (user_id: number) => {
		Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteMutation.mutate({ params: { user_id } }),
			},
		]);
	};

	if (isLoading) {
		return (
			<View style={styles.container}>
				<Typography>Loading...</Typography>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Card size="large" style={styles.card}>
				<Typography variant="h4" style={styles.title}>
					Users Management
				</Typography>

				<Button
					variant="contained"
					onPress={() => {
						/* Навигация к форме создания пользователя */
					}}
					style={styles.addButton}
				>
					Add New User
				</Button>

				{users?.map(user => (
					<Card key={user.id} size="small" variant={"outlined"} style={styles.userCard}>
						<View style={styles.userInfo}>
							<Typography variant="subtitle1">{user.nickname}</Typography>
							<Typography variant="body2">Id: {user.id}</Typography>
							<Typography variant="body2">Role: {user.role}</Typography>
							<Typography variant="body2">Status: {user.status}</Typography>
							<Typography variant="body2">Full name: {user.full_name}</Typography>
							<Typography variant="body2">Created at: {user.created_at}</Typography>
							<Typography variant="body2">Admin`s note: {user.admin_note}</Typography>
						</View>

						<View style={styles.actions}>
							<Button
								variant="outlined"
								onPress={() => {
									/* Навигация к форме редактирования */
								}}
							>
								Edit
							</Button>
							<Button variant="tint" onPress={() => handleDeleteUser(user.id)}>
								Delete
							</Button>
						</View>
					</Card>
				))}
			</Card>
		</ScrollView>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background.main,
	},
	card: {
		margin: theme.spacing(2),
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	addButton: {
		marginBottom: theme.spacing(3),
	},
	userCard: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
	},
	userInfo: {
		marginBottom: theme.spacing(2),
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(1),
	},
}));
