import { ActivityIndicator, Pressable, PressableProps, Text, TextProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { forwardRef } from "react";

export type ButtonVariant = "text" | "outlined" | "tint" | "contained";
export type ButtonColor = "primary" | "secondary" | "black";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends PressableProps {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;

	textProps?: TextProps;

	// default: true
	wrapText?: boolean;

	loading?: boolean;
	spinnerColor?: string;
}

const Button = forwardRef<View, ButtonProps>(function Button(
	{
		variant = "text",
		color = "primary",
		size = "medium",
		textProps,
		children,
		wrapText = true,
		loading = false,
		spinnerColor,
		disabled,
		...props
	},
	ref
) {
	styles.useVariants({
		size,
		variant,
		color,
		disabled: disabled ?? false,
	});

	return (
		<Pressable
			{...props}
			disabled={disabled}
			ref={ref}
			style={state => [
				styles.button,
				loading && styles.buttonLoading,
				typeof props.style === "function" ? props.style(state) : props.style,
			]}
		>
			{loading ? (
				<ActivityIndicator size={"small"} color={spinnerColor} />
			) : wrapText ? (
				state => (
					<Text {...textProps} style={[styles.text, textProps?.style]}>
						{typeof children === "function" ? children(state) : children}
					</Text>
				)
			) : (
				children
			)}
		</Pressable>
	);
});

export default Button;

const styles = StyleSheet.create((theme, rt) => ({
	buttonLoading: {
		opacity: 0.7,
	},

	button: {
		variants: {
			size: {
				small: {
					borderRadius: theme.borderRadius(1),
					paddingHorizontal: theme.spacing(1),
					paddingVertical: theme.spacing(0.75),
				},
				medium: {
					borderRadius: theme.borderRadius(1.5),
					paddingHorizontal: theme.spacing(1.25),
					paddingVertical: theme.spacing(1),
				},
				large: {
					borderRadius: theme.borderRadius(2),
					paddingHorizontal: theme.spacing(1.75),
					paddingVertical: theme.spacing(1.25),
				},
			},
			variant: {
				text: {},
				outlined: {},
				tint: {},
				contained: {},
			},
			color: {
				primary: {},
				secondary: {},
				black: {},
			},
			disabled: {
				true: {},
				false: {},
			},
		},
		compoundVariants: [
			{
				color: "primary",
				variant: "outlined",
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.primary.main,
				},
			},
			{
				color: "secondary",
				variant: "outlined",
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.secondary.main,
				},
			},
			{
				color: "black",
				variant: "outlined",
				styles: {
					borderWidth: 1,
					borderColor: "#141617",
				},
			},
			{
				color: "primary",
				variant: "tint",
				styles: {
					backgroundColor: `${theme.colors.primary.light}25`,
				},
			},
			{
				color: "secondary",
				variant: "tint",
				styles: {
					backgroundColor: `${theme.colors.secondary.main}20`,
				},
			},
			{
				color: "primary",
				variant: "contained",
				styles: {
					backgroundColor: theme.colors.primary.light,
				},
			},
			{
				color: "secondary",
				variant: "contained",
				styles: {
					backgroundColor: theme.colors.secondary.main,
				},
			},
			{
				color: "black",
				variant: "contained",
				styles: {
					backgroundColor: theme.colors.background.main,
					borderWidth: 1,
					borderColor: theme.colors.border,
				},
			},
			{
				variant: "outlined",
				disabled: true,
				styles: {
					borderColor: theme.colors.disabled.background,
				},
			},
			{
				variant: "contained",
				disabled: true,
				styles: {
					backgroundColor: theme.colors.disabled.background,
				},
			},
		],
	},
	text: {
		textTransform: "uppercase",
		variants: {
			variant: {
				text: {
					fontWeight: 600,
				},
				outlined: {
					fontWeight: 600,
				},
				tint: {
					fontWeight: 500,
				},
			},
		},
		compoundVariants: [
			{
				color: "primary",
				variant: "text",
				styles: {
					color: theme.colors.primary.main,
				},
			},
			{
				color: "secondary",
				variant: "text",
				styles: {
					color: theme.colors.secondary.main,
				},
			},
			{
				color: "primary",
				variant: "outlined",
				styles: {
					color: theme.colors.primary.main,
				},
			},
			{
				color: "black",
				variant: "outlined",
				styles: {
					color: "#141617",
				},
			},
			{
				color: "secondary",
				variant: "outlined",
				styles: {
					color: theme.colors.secondary.main,
				},
			},
			{
				color: "primary",
				variant: "tint",
				styles: {
					color:
						rt.themeName === "dark"
							? theme.colors.primary.light
							: theme.colors.primary.dark,
				},
			},
			{
				color: "secondary",
				variant: "tint",
				styles: {
					color:
						rt.themeName === "dark"
							? theme.colors.secondary.light
							: theme.colors.secondary.dark,
				},
			},
			{
				color: "primary",
				variant: "contained",
				styles: {
					color: theme.colors.primary.text,
				},
			},
			{
				color: "black",
				variant: "contained",
				styles: {
					color: theme.colors.text.primary,
				},
			},
			{
				color: "secondary",
				variant: "contained",
				styles: {
					color: theme.colors.secondary.text,
				},
			},
			{
				variant: "text",
				disabled: true,
				styles: {
					color: theme.colors.disabled.text,
				},
			},
			{
				variant: "outlined",
				disabled: true,
				styles: {
					color: theme.colors.disabled.text,
				},
			},
			{
				variant: "tint",
				disabled: true,
				styles: {
					color: theme.colors.disabled.text,
				},
			},
			{
				variant: "contained",
				disabled: true,
				styles: {
					color: theme.colors.disabled.text,
				},
			},
		],
	},
}));
