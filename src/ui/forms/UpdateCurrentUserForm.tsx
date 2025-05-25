// EditUserForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { UpdateUserData } from "@/api/users";
import { useTranslation } from "react-i18next";

interface EditUserFormProps {
	user: UpdateUserData;
	onClose: () => void;
	onSubmit: (userData: Partial<UpdateUserData>) => void;
	isLoading?: boolean;
	error?: string;
}

export default function UpdateCurrentUserForm({
	user,
	onClose,
	onSubmit,
	isLoading,
	error,
}: EditUserFormProps) {
	const { t } = useTranslation();

	const [formData, setFormData] = useState<Partial<UpdateUserData>>({
		nickname: user.nickname,
		full_name: user.full_name,
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.editUser")}: {user.nickname}
			</Typography>

			<Input
				label={t("profile.username") || "Username"}
				value={formData.nickname ?? undefined}
				onChangeText={text => setFormData({ ...formData, nickname: text })}
				style={styles.input}
			/>

			<Input
				label={t("profile.fullName") || "Full Name"}
				value={formData.full_name ?? undefined}
				onChangeText={text => setFormData({ ...formData, full_name: text })}
				style={styles.input}
			/>

			{error && <Typography color={"error"}>{error}</Typography>}

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("common.save")}
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
