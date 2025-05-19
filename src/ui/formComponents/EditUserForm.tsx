// EditUserForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";

import Select from "@/ui/Select";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";

import { roleOptions, statusOptions } from "@/ui/formComponents/Role-StatusOptions";
import { StyleSheet } from "react-native-unistyles";
import { UserRole, UserSchema, UserStatus } from "@/api/admin";
import { useIsSuperAdmin } from "@/context/AuthContext";

interface EditUserFormProps {
	user: UserSchema;
	onClose: () => void;
	onSubmit: (userData: Partial<UserSchema>) => void;
	isLoading?: boolean;
}

export default function EditUserForm({ user, onClose, onSubmit, isLoading }: EditUserFormProps) {
	const isSuperAdmin = useIsSuperAdmin();

	const [formData, setFormData] = useState<Partial<UserSchema>>({
		nickname: user.nickname,
		role: user.role,
		status: user.status,
		full_name: user.full_name,
		admin_note: user.admin_note,
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				Edit User: {user.nickname}
			</Typography>

			<Input
				label="Nickname"
				value={formData.nickname}
				onChangeText={text => setFormData({ ...formData, nickname: text })}
				style={styles.input}
			/>

			<Select
				label="Role"
				value={formData.role}
				options={
					isSuperAdmin
						? roleOptions
						: roleOptions.filter(option => option.value !== "admin")
				}
				onChange={value => setFormData({ ...formData, role: value as UserRole })}
				style={styles.input}
			/>

			<Select
				label="Status"
				value={formData.status}
				options={statusOptions}
				onChange={value => setFormData({ ...formData, status: value as UserStatus })}
				style={styles.input}
			/>

			<Input
				label="Full Name"
				value={formData.full_name ?? undefined}
				onChangeText={text => setFormData({ ...formData, full_name: text })}
				style={styles.input}
			/>

			<Input
				label="Admin Note"
				value={formData.admin_note ?? undefined}
				onChangeText={text => setFormData({ ...formData, admin_note: text })}
				style={styles.input}
				size="large"
				multiline
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					Save Changes
				</Button>
				<Button variant="outlined" onPress={onClose}>
					Cancel
				</Button>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(3),
		maxWidth: 600,
		width: "100%",
		alignSelf: "center",
	},
	title: {
		marginBottom: theme.spacing(3),
	},
	input: {
		marginBottom: theme.spacing(2),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		marginTop: theme.spacing(3),
	},
}));
