import { TextInput, TextInputProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { forwardRef } from "react";
import Typography from "@/ui/common/Typography";

export type InputVariant = "outlined" | "filled";
export type InputColor = "primary" | "secondary";
export type InputSize = "small" | "medium" | "large";

export interface InputProps extends Omit<TextInputProps, "placeholderTextColor"> {
	variant?: InputVariant;
	color?: InputColor;
	size?: InputSize;
	label?: string;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
}

const Input = forwardRef<TextInput, InputProps>(function Input(
	{
		variant = "outlined",
		color = "primary",
		size = "medium",
		label,
		error,
		helperText,
		...props
	},
	ref
) {
	styles.useVariants({
		size,
		variant,
		color,
		error: !!error,
	});

	return (
		<View style={styles.container}>
			{label && (
				<Typography
					variant="subtitle2"
					color={error ? "error" : color ? `text.${color}` : undefined}
					style={styles.label}
				>
					{label}
				</Typography>
			)}
			<View style={styles.inputWrapper}>
				{props.icon && <View style={styles.icon}>{props.icon}</View>}
				<TextInput
					ref={ref}
					{...props}
					style={[styles.input, props.style, props.icon ? styles.paddingLeft : undefined]}
					// placeholderTextColor={theme => theme.colors.text.secondary}
				/>
			</View>
			{(error || helperText) && (
				<Typography
					variant="body2"
					color={error ? "error" : "text.secondary"}
					style={styles.helperText}
				>
					{error || helperText}
				</Typography>
			)}
		</View>
	);
});

const styles = StyleSheet.create(theme => ({
	container: {},
	label: {
		color: theme.colors.text.secondary,
		marginBottom: theme.spacing(0.25),
	},
	inputWrapper: {
		position: "relative",
		justifyContent: "center",
	},
	paddingLeft: {
		paddingLeft: theme.spacing(4),
	},
	icon: {
		position: "absolute",
		left: 10,
		zIndex: 1,
	},
	helperText: {
		marginTop: theme.spacing(0.5),
	},
	input: {
		variants: {
			size: {
				small: {
					height: 32,
					paddingHorizontal: theme.spacing(1),
					borderRadius: theme.borderRadius(1),
				},
				medium: {
					height: 40,
					paddingHorizontal: theme.spacing(1.25),
					borderRadius: theme.borderRadius(1),
				},
				large: {
					height: 48,
					paddingHorizontal: theme.spacing(1.75),
					borderRadius: theme.borderRadius(2),
				},
			},
			variant: {
				outlined: {},
				filled: {},
			},
			color: {
				primary: {},
				secondary: {},
			},
			error: {
				true: {},
				false: {},
			},
		},
		compoundVariants: [
			{
				variant: "outlined",
				error: false,
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.text.secondary,
				},
			},
			{
				variant: "filled",
				error: false,
				styles: {
					backgroundColor: `${theme.colors.text.secondary}15`,
					color: theme.colors.text.primary,
				},
			},
			{
				color: "primary",
				variant: "outlined",
				error: false,
				styles: {
					color: theme.colors.text.primary,
					":focus": {
						borderColor: theme.colors.primary.main,
					},
				},
			},
			{
				color: "secondary",
				variant: "outlined",
				error: false,
				styles: {
					color: theme.colors.text.secondary,
					":focus": {
						borderColor: theme.colors.secondary.main,
					},
				},
			},
			{
				error: true,
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.error.main,
				},
			},
		],
	},
}));

export default Input;
