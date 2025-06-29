import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { forwardRef } from "react";

export type CardVariant = "outlined" | "contained" | "standard";
export type CardColor = "primary" | "secondary";
export type CardSize = "small" | "medium" | "large";

export interface CardProps extends ViewProps {
	variant?: CardVariant;
	color?: CardColor;
	size?: CardSize;
}

const Card = forwardRef<View, CardProps>(function Card(
	{ variant = "contained", color = "primary", size = "medium", children, ...props },
	ref
) {
	styles.useVariants({
		size,
		variant,
		color,
	});

	return (
		<View {...props} ref={ref} style={[styles.card, props.style]}>
			{children}
		</View>
	);
});

const styles = StyleSheet.create(theme => ({
	card: {
		padding: theme.spacing(2),
		backgroundColor: theme.colors.background.paper,
		variants: {
			size: {
				small: {
					borderRadius: theme.borderRadius(1),
					gap: theme.spacing(1),
				},
				medium: {
					borderRadius: theme.borderRadius(1.5),
					gap: theme.spacing(1.5),
				},
				large: {
					borderRadius: theme.borderRadius(2),
					gap: theme.spacing(2),
				},
			},
			variant: {
				standard: {},
				outlined: {},
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
				variant: "standard",
				styles: {
					borderRadius: theme.borderRadius(3),
				},
			},
			{
				color: "secondary",
				variant: "standard",
				styles: {
					borderRadius: theme.borderRadius(3),
				},
			},
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
				variant: "contained",
				styles: {
					boxShadow: `0 2px 3.84px 0.25px ${theme.colors.primary.main}`,
				},
			},
			{
				color: "secondary",
				variant: "contained",
				styles: {
					boxShadow: `0 2px 3.84px 0.25px ${theme.colors.secondary.main}`,
				},
			},
		],
	},
}));

export default Card;
