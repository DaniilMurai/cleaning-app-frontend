// EditUserForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/common/Input";
import { useState } from "react";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";

import { roleOptions, statusOptions } from "@/core/helpers/Role-StatusOptions";
import { StyleSheet } from "react-native-unistyles";
import { AdminReadUser, UserRole, UserStatus } from "@/api/admin";
import CustomPicker from "@/ui/common/Picker";
import { useTranslation } from "react-i18next";
import { useIsSuperAdmin } from "@/core/auth";

interface EditUserFormProps {
	user: AdminReadUser;
	onClose: () => void;
	onSubmit: (userData: Partial<AdminReadUser>) => void;
	isLoading?: boolean;
}

export default function EditUserForm({ user, onClose, onSubmit, isLoading }: EditUserFormProps) {
	const isSuperAdmin = useIsSuperAdmin();
	const { t } = useTranslation();

	const [formData, setFormData] = useState<Partial<AdminReadUser>>({
		nickname: user.nickname,
		role: user.role,
		status: user.status,
		full_name: user.full_name,
		admin_note: user.admin_note,
	});

	const isDisabled = formData.nickname === "" || formData.full_name === "";

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
				value={formData.nickname ?? ""}
				onChangeText={text => setFormData({ ...formData, nickname: text })}
				style={styles.input}
			/>
			<View style={{ zIndex: 10 }}>
				<CustomPicker
					label={t("components.usersList.role")}
					value={formData.role}
					options={
						isSuperAdmin
							? roleOptions
							: roleOptions.filter(option => option.value !== "admin")
					}
					onChange={value => setFormData({ ...formData, role: value as UserRole })}
					style={styles.input}
				/>
			</View>

			<View style={{ zIndex: 1 }}>
				<CustomPicker
					label={t("components.usersList.status")}
					value={formData.status}
					options={statusOptions}
					onChange={value => setFormData({ ...formData, status: value as UserStatus })}
					style={styles.input}
				/>
			</View>
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
				<Button
					variant="contained"
					onPress={handleSubmit}
					disabled={isDisabled}
					loading={isLoading}
				>
					{t("admin.editUser")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.cancel")}
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
