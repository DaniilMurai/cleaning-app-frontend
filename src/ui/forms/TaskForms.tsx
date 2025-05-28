// TaskForms.tsx
import { View } from "react-native";
import { Button } from "@/ui";
import Input from "@/ui/Input";
import { useState } from "react";
import Card from "@/ui/Card";
import Typography from "@/ui/Typography";
import { StyleSheet } from "react-native-unistyles";
import { useTranslation } from "react-i18next";
import { TaskCreate, TaskResponse, TaskUpdate } from "@/api/admin";

interface CreateTaskFormProps {
	onSubmit: (taskData: TaskCreate) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function CreateTaskForm({ onSubmit, onClose, isLoading }: CreateTaskFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<TaskCreate>({
		title: "",
		description: "",
		frequency: 1,
	});

	const handleSubmit = () => {
		onSubmit(formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.createTask")}
			</Typography>

			<Input
				label={t("components.tasksList.title") + "*"}
				value={formData.title}
				onChangeText={text => setFormData({ ...formData, title: text })}
				style={styles.input}
			/>

			<Input
				label={t("components.tasksList.description")}
				value={formData.description || ""}
				onChangeText={text => setFormData({ ...formData, description: text })}
				style={styles.input}
				multiline
			/>

			<Input
				label={t("components.tasksList.frequency") + "*"}
				value={formData.frequency.toString()}
				onChangeText={text => setFormData({ ...formData, frequency: parseInt(text) || 0 })}
				style={styles.input}
				keyboardType="numeric"
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("admin.createTask")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.close")}
				</Button>
			</View>
		</Card>
	);
}

interface EditTaskFormProps {
	task: TaskResponse;
	onSubmit: (taskId: EditTaskParams, taskData: TaskUpdate) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function EditTaskForm({ task, onSubmit, onClose, isLoading }: EditTaskFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<TaskUpdate>({
		title: task.title,
		description: task.description,
		frequency: task.frequency,
	});

	const handleSubmit = () => {
		onSubmit({ task_id: task.id }, formData);
	};

	return (
		<Card size="large" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.editTask")}
			</Typography>

			<Input
				label={t("components.tasksList.title") + "*"}
				value={formData.title || ""}
				onChangeText={text => setFormData({ ...formData, title: text })}
				style={styles.input}
			/>

			<Input
				label={t("components.tasksList.description")}
				value={formData.description || ""}
				onChangeText={text => setFormData({ ...formData, description: text })}
				style={styles.input}
				multiline
			/>

			<Input
				label={t("components.tasksList.frequency") + "*"}
				value={formData.frequency?.toString() || ""}
				onChangeText={text => setFormData({ ...formData, frequency: parseInt(text) || 0 })}
				style={styles.input}
				keyboardType="numeric"
			/>

			<View style={styles.buttonsContainer}>
				<Button variant="contained" onPress={handleSubmit} loading={isLoading}>
					{t("common.save")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.cancel")}
				</Button>
			</View>
		</Card>
	);
}

interface DeleteTaskConfirmProps {
	task: TaskResponse;
	onConfirm: (taskId: DeleteTaskParams) => void;
	onClose: () => void;
	isLoading?: boolean;
}

export function DeleteTaskConfirm({ task, onConfirm, onClose, isLoading }: DeleteTaskConfirmProps) {
	const { t } = useTranslation();

	return (
		<Card size="medium" style={styles.container}>
			<Typography variant="h5" style={styles.title}>
				{t("admin.deleteTask")}
			</Typography>

			<Typography variant="body1">
				{t("admin.deleteTaskConfirmation", { title: task.title })}
			</Typography>

			<View style={styles.buttonsContainer}>
				<Button
					variant="contained"
					style={styles.buttonError}
					onPress={() => onConfirm({ task_id: task.id })}
					loading={isLoading}
				>
					{t("common.delete")}
				</Button>
				<Button variant="outlined" onPress={onClose}>
					{t("common.cancel")}
				</Button>
			</View>
		</Card>
	);
}

// I'm also adding a supplementary hook for task mutations, similar to the useLocationMutation
export interface EditTaskParams {
	task_id: number;
}

export interface DeleteTaskParams {
	task_id: number;
}

const styles = StyleSheet.create(theme => ({
	container: {
		padding: theme.spacing(3),
		width: "100%",
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	input: {
		marginBottom: theme.spacing(0.5),
	},
	buttonsContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: theme.spacing(3),
		gap: theme.spacing(2),
	},
	buttonError: {
		backgroundColor: theme.colors.error.main,
	},
}));
