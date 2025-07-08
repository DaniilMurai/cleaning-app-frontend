import { Text, TextProps, TextStyle } from "react-native";
import { forwardRef } from "react";
import { UIColor } from "@/unistyles";
import { StyleSheet } from "react-native-unistyles";

export interface TypographyProps extends TextProps {
	color?: UIColor | "text.primary" | "text.secondary" | string;
	variant?:
		| "h1"
		| "h2"
		| "h3"
		| "h4"
		| "h5"
		| "h6"
		| "subtitle1"
		| "subtitle2"
		| "body1"
		| "body2";
	userSelect?: TextStyle["userSelect"];
}

const Typography = forwardRef<Text, TypographyProps>(
	({ variant = "body1", color, userSelect, children, ...props }, ref) => {
		styles.useVariants({
			variant,
		});
		return (
			<Text
				ref={ref}
				accessibilityRole={variant.startsWith("body") ? "text" : "header"}
				// @ts-expect-error accessibilityLevel isn't specified in Text styles
				accessibilityLevel={
					variant.startsWith("h")
						? +variant.replace("h", "")
						: variant.startsWith("subtitle")
							? 6
							: undefined
				}
				{...props}
				style={[
					styles.typography,
					styles.text(color),
					{
						...(userSelect && { userSelect }),
					},
					props.style,
				]}
			>
				{children}
			</Text>
		);
	}
);

const styles = StyleSheet.create(theme => ({
	text: (color: TypographyProps["color"]) => ({
		color:
			!color || color === "text.primary"
				? theme.colors.text.primary
				: color === "text.secondary"
					? theme.colors.text.secondary
					: color in theme.colors
						? theme.colors[color as UIColor].main
						: color,
	}),
	typography: {
		color: theme.colors.text.primary,
		variants: {
			variant: {
				h1: {
					fontWeight: "300",
					fontSize: 96,
					lineHeight: 96 * 1.67,
				},
				h2: {
					fontWeight: "300",
					fontSize: 60,
					lineHeight: 60 * 1.2,
				},
				h3: {
					fontWeight: "400",
					fontSize: 48,
					lineHeight: 48 * 1.167,
				},
				h4: {
					fontWeight: "400",
					fontSize: 34,
					lineHeight: 34 * 1.235,
				},
				h5: {
					fontWeight: "400",
					fontSize: 24,
					lineHeight: 24 * 1.334,
				},
				h6: {
					fontWeight: "500",
					fontSize: 18,
					lineHeight: 20 * 1.6,
				},
				subtitle1: {
					fontWeight: "400",
					fontSize: 16,
					lineHeight: 16 * 1.5,
				},
				subtitle2: {
					fontWeight: "500",
					fontSize: 14,
					lineHeight: 14 * 1.57,
				},
				body1: {
					fontWeight: "400",
					fontSize: 16,
					lineHeight: 16 * 1.5,
				},
				body2: {
					fontWeight: "400",
					fontSize: 13,
					lineHeight: 13 * 1.43,
				},
			},
		},
	},
}));

export default Typography;
