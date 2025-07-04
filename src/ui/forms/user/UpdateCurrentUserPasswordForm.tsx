// UpdateCurrentUserPasswordForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import { useRef, useState } from "react";
import Card from "@/ui/common/Card";
import Typography from "@/ui/common/Typography";
import { StyleSheet } from "react-native-unistyles";
import { UserUpdatePassword } from "@/api/users";
import PasswordInputs, { PasswordInputsRef } from "@/components/passwords/2PasswordInputs";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/passwords/PasswordInput";
import FormHelper from "@/ui/forms/common/FormHelper";
import { usePasswordValidator } from "@/core/validators";

interface EditUserFormProps {
	onClose: () => void;
	onSubmit: (userData: UserUpdatePassword) => void;
	isLoading?: boolean;
	error?: string;
}

export default function UpdateCurrentUserPasswordForm({
	onClose,
	onSubmit,
	isLoading,
	error,
}: EditUserFormProps) {
	const [formErrors, setFormErrors] = useState({
		old_password: "",
		new_password: "",
	});

	const { t } = useTranslation();

	const [password, setPassword] = useState("");
	const passwordInputsRef = useRef<PasswordInputsRef>(null);

	const validatePassword = usePasswordValidator(1);

	const handleSubmit = () => {
		// Сбросить ошибки
		setFormErrors({
			old_password: "",
			new_password: "",
		});

		// Валидация нового пароля через PasswordInputs компонент
		if (passwordInputsRef.current) {
			const result1 = !validatePassword(password);
			const result2 = passwordInputsRef.current.validate();
			if (result1 && result2.isValid) {
				// Обновляем состояние formData новым паролем и отправляем данные
				const updatedData = {
					old_password: password,
					new_password: result2.password,
				};

				// Обновить состояние и отправить форму
				onSubmit(updatedData);
			}
		}
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("profile.changePassword")}
			</Typography>

			<PasswordInput
				placeholder={t("auth.oldPassword")}
				value={password}
				onChangeText={setPassword}
			/>

			<PasswordInputs
				placeholder1={t("auth.newPassword")}
				placeholder2={t("auth.confirmPassword")}
				ref={passwordInputsRef}
				minLength={8}
			/>

			{!!formErrors.new_password && (
				<FormHelper color={"error"}>{formErrors.new_password}</FormHelper>
			)}

			{!!error && (
				<Typography color={"error"} style={styles.errorText}>
					{error}
				</Typography>
			)}

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
		marginBottom: theme.spacing(0.5),
	},
	sectionLabel: {
		marginBottom: theme.spacing(1),
		fontWeight: "bold",
	},
	errorText: {
		marginTop: theme.spacing(1),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
		marginTop: theme.spacing(3),
	},
}));
