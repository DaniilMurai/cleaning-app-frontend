import { RegisterUserData, UserRole } from "@/api/admin";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import Input from "@/ui/Input";
import Select from "@/ui/Select";
import { roleOptions } from "@/ui/formComponents/Role-StatusOptions";
import { View } from "react-native";
import { Button } from "@/ui";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { useIsSuperAdmin } from "@/context/AuthContext";

interface CreateUserFormProps {
	onSubmit: (userData: RegisterUserData) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export default function CreateUserForm({ onSubmit, onClose, isLoading }: CreateUserFormProps) {
	const { t } = useTranslation();

	const isSuperAdmin = useIsSuperAdmin();
	const [formData, setFormData] = useState<RegisterUserData>({
		full_name: "",
		role: "employee",
		admin_note: "",
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.createUser")}
			</Typography>

			<Input
				label={t("profile.fullName")}
				value={formData.full_name}
				onChangeText={text => setFormData({ ...formData, full_name: text })}
				style={styles.input}
			/>

			<Select
				label={t("components.usersList.role")}
				value={formData.role ?? "employee"}
				options={
					isSuperAdmin
						? roleOptions
						: roleOptions.filter(option => option.value !== "admin")
				}
				onChange={value => setFormData({ ...formData, role: value as UserRole })}
				style={styles.input}
			/>

			<Input
				label={t("components.usersList.adminNote")}
				value={formData.admin_note ?? undefined}
				onChangeText={text => setFormData({ ...formData, admin_note: text })}
				style={styles.input}
				size="large"
				multiline
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("admin.createUser")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.close")}
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
