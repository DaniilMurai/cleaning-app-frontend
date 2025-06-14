import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { forwardRef } from "react";

export type CardVariant = "outlined" | "contained" | "default";
export type CardColor = "primary" | "secondary";
export type CardSize = "small" | "medium" | "large";

export interface CardProps extends ViewProps {
	variant?: CardVariant;
	color?: CardColor;
	size?: CardSize;
	borderLeftColor?: CardColor | string | any;
}

const Card = forwardRef<View, CardProps>(function Card(
	{
		variant = "contained",
		color = "primary",
		size = "medium",
		borderLeftColor,
		children,
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
		<View
			{...props}
			ref={ref}
			style={[
				styles.card,
				props.style,
				borderLeftColor && {
					borderLeftColor: borderLeftColor,
					borderLeftWidth: 5,
					shadowColor: "transparent",
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 0,
					shadowRadius: 0,
				},
			]}
		>
			{children}
		</View>
	);
});

const styles = StyleSheet.create(theme => ({
	card: {
		padding: theme.spacing(2),
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
				outlined: {},
				contained: {},
				default: {},
			},
			color: {
				primary: {},
				secondary: {},
			},
		},
		compoundVariants: [
			{
				color: "primary",
				variant: "default",
				styles: {
					backgroundColor: theme.colors.background.paper,
					borderRadius: theme.borderRadius(3),
				},
			},
			{
				color: "primary",
				variant: "outlined",
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.primary.main,
					backgroundColor: theme.colors.background.paper,
				},
			},
			{
				color: "secondary",
				variant: "outlined",
				styles: {
					borderWidth: 1,
					borderColor: theme.colors.secondary.main,
					backgroundColor: theme.colors.background.paper,
				},
			},
			{
				color: "primary",
				variant: "contained",
				styles: {
					backgroundColor: theme.colors.background.paper,
					shadowColor: theme.colors.primary.main,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				},
			},
			{
				color: "secondary",
				variant: "contained",
				styles: {
					backgroundColor: theme.colors.background.paper,
					shadowColor: theme.colors.secondary.main,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				},
			},
		],
	},
}));

export default Card;
