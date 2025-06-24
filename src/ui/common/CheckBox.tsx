import React, { forwardRef, useMemo } from "react";
import { Pressable, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { FontAwesome5 } from "@expo/vector-icons";
import Typography from "./Typography";

export interface CheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	size?: "small" | "medium" | "large";
	color?: "primary" | "secondary" | "success" | "warning" | "error";
	indeterminate?: boolean; // Добавляем новое свойство
}

const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
	{
		checked,
		onChange,
		label,
		disabled = false,
		size = "medium",
		color = "primary",
		indeterminate = false,
		...props
	},
	ref
) {
	const { theme } = useUnistyles();
	styles.useVariants({ size, color, checked, disabled });

	const iconColor = useMemo(() => {
		if (indeterminate) return theme.colors.warning.main; // Особый цвет для промежуточного состояния
		if (!checked && color != "error") return "transparent";

		switch (color) {
			case "primary":
				return theme.colors.primary.text;
			case "secondary":
				return theme.colors.secondary.text;
			case "success":
				return theme.colors.success.main;
			case "warning":
				return theme.colors.warning.main;
			case "error":
				return theme.colors.error.main;
			default:
				return theme.colors.primary.text;
		}
	}, [checked, indeterminate, color, theme]);

	const handlePress = () => {
		if (!disabled) {
			onChange(!checked);
		}
	};
	
	return (
		<Pressable
			ref={ref}
			onPress={handlePress}
			style={state => [styles.container, state.pressed && !disabled && styles.pressed]}
			accessibilityRole="checkbox"
			accessibilityState={{ checked, disabled }}
			{...props}
		>
			<View style={styles.checkbox}>
				{indeterminate ? (
					<FontAwesome5
						name="minus"
						size={size === "small" ? 12 : size === "medium" ? 16 : 18}
						color={iconColor}
					/>
				) : checked ? (
					<FontAwesome5
						name="check"
						size={size === "small" ? 12 : size === "medium" ? 16 : 18}
						color={iconColor}
					/>
				) : !checked && color == "error" ? (
					<FontAwesome5
						name="times"
						size={size === "small" ? 12 : size === "medium" ? 16 : 18}
						color={iconColor}
					/>
				) : null}
			</View>

			{label && (
				<Typography
					variant="body2"
					style={styles.label}
					color={disabled ? "text.disabled" : "text.primary"}
				>
					{label}
				</Typography>
			)}
		</Pressable>
	);
});

const styles = StyleSheet.create(theme => ({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: theme.spacing(1.5),
	},
	pressed: {
		opacity: 0.7,
	},
	checkbox: {
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: theme.colors.divider,
		borderRadius: theme.borderRadius(10),
		backgroundColor: theme.colors.background.main,

		variants: {
			size: {
				small: {
					width: 16,
					height: 16,
				},
				medium: {
					width: 20,
					height: 20,
				},
				large: {
					width: 24,
					height: 24,
				},
			},
			checked: {
				true: {},
				false: {},
			},
			color: {
				primary: {},
				secondary: {},
				success: {},
				warning: {},
				error: {},
			},
			disabled: {
				true: {
					opacity: 0.5,
				},
				false: {},
			},
		},
		compoundVariants: [
			{
				color: "primary",
				checked: true,
				styles: {
					backgroundColor: theme.colors.primary.main,
					borderColor: theme.colors.primary.main,
				},
			},
			{
				color: "secondary",
				checked: true,
				styles: {
					backgroundColor: theme.colors.secondary.main,
					borderColor: theme.colors.secondary.main,
				},
			},
			{
				color: "success",
				checked: true,
				styles: {
					backgroundColor: theme.colors.success.background,
					borderColor: theme.colors.success.main,
				},
			},
			{
				color: "warning",
				checked: false,
				styles: {
					backgroundColor: theme.colors.warning.background,
					borderColor: theme.colors.warning.main,
				},
			},
			{
				color: "error",
				checked: false,
				styles: {
					backgroundColor: theme.colors.error.background,
					borderColor: theme.colors.error.main,
				},
			},
			// Добавляем для промежуточного состояния
			{
				color: "warning",
				indeterminate: true,
				styles: {
					backgroundColor: theme.colors.warning.background,
					borderColor: theme.colors.warning.main,
				},
			},
		],
	},
	icon: {
		color: theme.colors.primary.text,
		compoundVariants: [
			{
				color: "primary",
				checked: true,
				styles: {
					color: theme.colors.primary.text,
				},
			},
			{
				color: "secondary",
				checked: true,
				styles: {
					color: theme.colors.secondary.text,
				},
			},
			{
				color: "success",
				checked: true,
				styles: {
					color: theme.colors.success.main,
				},
			},
		],
	},
	label: {
		flexShrink: 1,
	},
}));

export default Checkbox;
