// Select.tsx
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "./Typography";
import Card from "./Card";
import { FontAwesome5 } from "@expo/vector-icons";

interface SelectOption {
	label: string;
	value: string;
}

interface SelectProps {
	label?: string;
	value?: string;
	options: SelectOption[];
	onChange: (value: string) => void;
	style?: any;
}

export default function Select({ label, value, options, onChange, style }: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);

	const selectedOption = options.find(option => option.value === value);

	return (
		<View style={[styles.container, style]}>
			{label && (
				<Typography variant="body2" color="text.secondary" style={styles.label}>
					{label}
				</Typography>
			)}

			<Pressable
				style={state => [styles.select, state.pressed && styles.selectPressed]}
				onPress={() => setIsOpen(true)}
			>
				<Typography style={styles.selectText}>
					{selectedOption?.label || "Select option"}
				</Typography>
				<FontAwesome5 name="chevron-down" size={12} color={styles.icon.color} />
			</Pressable>

			<Modal
				visible={isOpen}
				transparent
				animationType="fade"
				onRequestClose={() => setIsOpen(false)}
			>
				<Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
					<Card size="medium" style={styles.modalContent}>
						<ScrollView>
							{options.map(option => (
								<Pressable
									key={option.value}
									style={styles.option}
									onPress={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
								>
									<Typography
										style={[
											styles.optionText,
											option.value === value && styles.selectedOption,
										]}
									>
										{option.label}
									</Typography>
								</Pressable>
							))}
						</ScrollView>
					</Card>
				</Pressable>
			</Modal>
		</View>
	);
}
const styles = StyleSheet.create(theme => ({
	container: {
		width: "100%",
	},
	label: {
		marginBottom: theme.spacing(0.5),
	},
	select: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: theme.colors.divider,
		borderRadius: theme.borderRadius(1),
		padding: theme.spacing(1),
		backgroundColor: theme.colors.background.paper,
	},
	selectPressed: {
		opacity: 0.7,
	},
	selectText: {
		flex: 1,
		color: theme.colors.text.primary,
	},
	icon: {
		color: theme.colors.text.primary,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing(2),
	},
	modalContent: {
		width: "100%",
		maxWidth: 400,
		maxHeight: "80%",
	},
	option: {
		padding: theme.spacing(1.5),
	},
	optionText: {
		color: theme.colors.text.primary,
	},
	selectedOption: {
		color: theme.colors.primary.main,
		fontWeight: "600",
	},
}));
