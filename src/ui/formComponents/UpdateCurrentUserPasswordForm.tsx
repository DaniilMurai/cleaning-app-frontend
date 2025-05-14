// EditUserForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { UserUpdatePassword } from "@/api/users";

interface EditUserFormProps {
	onClose: () => void;
	onSubmit: (userData: UserUpdatePassword) => void;
	isLoading?: boolean;
}

export default function UpdateCurrentUserPasswordForm({
	onClose,
	onSubmit,
	isLoading,
}: EditUserFormProps) {
	const [formData, setFormData] = useState<UserUpdatePassword>({
		old_password: "",
		new_password: "",
	});
	const [error, setError] = useState<string>("");

	const [repeatedPassword, setRepeatPassword] = useState<string>("");

	const handleSubmit = () => {
		setError("");
		if (formData.new_password !== repeatedPassword) {
			setError("Passwords do not match");
			return;
		} else {
			onSubmit(formData);
		}
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				Change Password
			</Typography>

			<Input
				label="Old password"
				value={formData.old_password}
				onChangeText={text => setFormData({ ...formData, old_password: text })}
				style={styles.input}
				secureTextEntry={true}
			/>

			<Input
				label="New password"
				value={formData.new_password}
				onChangeText={text => setFormData({ ...formData, new_password: text })}
				style={styles.input}
				secureTextEntry={true}
			/>

			<Input
				label="Repeat new password"
				value={repeatedPassword}
				onChangeText={text => setRepeatPassword(text)}
				style={styles.input}
				secureTextEntry={true}
			/>

			{error && (
				<Typography variant={"body1"} color={"error"}>
					{error}
				</Typography>
			)}

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
