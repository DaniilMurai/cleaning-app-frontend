// UpdateCurrentUserPasswordForm.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useRef, useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { UserUpdatePassword } from "@/api/users";
import PasswordInputs, { PasswordInputsRef } from "@/ui/components/common/2PasswordInputs";
import { useTranslation } from "react-i18next";

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
	const [formData, setFormData] = useState<UserUpdatePassword>({
		old_password: "",
		new_password: "",
	});
	const [formErrors, setFormErrors] = useState({
		old_password: "",
		new_password: "",
	});

	const { t } = useTranslation();

	const passwordInputsRef = useRef<PasswordInputsRef>(null);

	const handleSubmit = () => {
		// Сбросить ошибки
		setFormErrors({
			old_password: "",
			new_password: "",
		});

		// Проверка старого пароля
		if (!formData.old_password || formData.old_password.trim() === "") {
			setFormErrors(prev => ({
				...prev,
				old_password: t("validation.required"),
			}));
			return;
		}

		// Валидация нового пароля через PasswordInputs компонент
		if (passwordInputsRef.current) {
			const result = passwordInputsRef.current.validate();
			if (result.isValid) {
				// Обновляем состояние formData новым паролем и отправляем данные
				const updatedData = {
					old_password: formData.old_password,
					new_password: result.password,
				};

				// Обновить состояние и отправить форму
				setFormData(updatedData);
				onSubmit(updatedData);
			}
		}
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("profile.changePassword")}
			</Typography>

			<Input
				placeholder={t("auth.oldPassword")}
				value={formData.old_password}
				onChangeText={text => setFormData({ ...formData, old_password: text })}
				style={styles.input}
				secureTextEntry={true}
				helperText={formErrors.old_password}
			/>

			<PasswordInputs
				placeholder1={t("auth.newPassword")}
				placeholder2={t("auth.confirmPassword")}
				ref={passwordInputsRef}
				minLength={8}
				statusMessages={{
					error: formErrors.new_password || null,
				}}
			/>

			{error ? (
				<Typography variant={"body1"} color={"error"} style={styles.errorText}>
					{error}
				</Typography>
			) : null}

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
