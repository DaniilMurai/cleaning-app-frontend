import { ActivityIndicator, Pressable, PressableProps, Text, TextProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { forwardRef } from "react";

export type ButtonVariant = "text" | "outlined" | "tint" | "contained";
export type ButtonColor = "primary" | "secondary";
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
		...props
	},
	ref
) {
	styles.useVariants({
		size,
		variant,
		color,
	});

	return (
		<Pressable
			{...props}
			ref={ref}
			style={state => [
				styles.button,
				loading && styles.buttonLoading,
				typeof props.style === "function" ? props.style(state) : props.style,
			]}
		>
			{loading ? (
				<ActivityIndicator
					size={size === "small" ? "small" : "small"}
					color={spinnerColor}
				/>
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
					borderRadius: theme.borderRadius(1),
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
				color: "secondary",
				variant: "contained",
				styles: {
					color: theme.colors.secondary.text,
				},
			},
		],
	},
}));
