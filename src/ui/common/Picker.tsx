import React from "react";
import { Pressable, View } from "react-native";
import Typography from "./Typography";
import BasePopover from "./BasePopover";
import { StyleSheet } from "react-native-unistyles";
import { FontAwesome5 } from "@expo/vector-icons";

export interface PickerOption {
	label: string;
	value: string | null;
}

interface CustomPickerProps {
	label?: string;
	value?: string | null;
	options: PickerOption[];
	onChange: (value: string | null) => void;
	style?: any;
	placeholder?: string;
}

export default function CustomPicker({
	label,
	value,
	options,
	onChange,
	style,
	placeholder = "Выберите...",
}: CustomPickerProps) {
	const selectedOption = options.find(option => option.value === value);

	return (
		<View style={[style, { flex: 1, zIndex: 100 }]}>
			{label && (
				<Typography variant="body2" color="text.secondary" style={styles.label}>
					{label}
				</Typography>
			)}

			<BasePopover
				itemHeight={56}
				maxItemVisible={4}
				closeOnItemPress={true}
				trigger={
					<Pressable style={styles.select}>
						<Typography style={styles.selectText}>
							{selectedOption?.label || placeholder}
						</Typography>
						<FontAwesome5 name="chevron-down" size={12} color={styles.icon.color} />
					</Pressable>
				}
			>
				{options.map(option => (
					<Pressable
						key={option.value}
						style={({ pressed }) => [
							styles.option,
							value === option.value && styles.selectedOption,
							pressed && styles.optionPressed,
						]}
						onPress={() => onChange(option.value)}
					>
						<Typography
							style={[
								styles.optionText,
								value === option.value && styles.selectedText,
							]}
						>
							{option.label}
						</Typography>
					</Pressable>
				))}
			</BasePopover>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	label: {
		marginBottom: theme.spacing(0.5),
	},
	select: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: theme.colors.divider,
		borderRadius: theme.borderRadius(2),
		padding: theme.spacing(1.5),
		backgroundColor: theme.colors.background.main,
	},
	selectText: {
		flex: 1,
		color: theme.colors.text.primary,
	},
	icon: {
		color: theme.colors.text.primary,
		marginLeft: theme.spacing(1),
	},
	option: {
		paddingVertical: theme.spacing(1.5),
		paddingHorizontal: theme.spacing(2),
	},
	optionPressed: {
		backgroundColor: theme.colors.background.default,
	},
	optionText: {
		color: theme.colors.text.primary,
	},
	selectedOption: {
		backgroundColor: theme.colors.primary.light,
	},
	selectedText: {
		color: theme.colors.text.primary,
		fontWeight: "600",
	},
}));
