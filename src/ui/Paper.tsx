import { View } from "react-native";
import { ComponentPropsWithRef, ElementType, forwardRef, ReactNode } from "react";
import { StyleSheet } from "react-native-unistyles";
import { SHADOWS } from "@/unistyles";

export type PaperProps<TElement extends ElementType = typeof View> =
	ComponentPropsWithRef<TElement> & {
		component?: TElement;
		elevation?: number;
		spacing?: "normal" | "dense" | "disabled";
		rounded?: boolean;
	};

const Paper = forwardRef<View, PaperProps>(function Paper(
	{ elevation = 2, spacing = "normal", rounded = true, children, ...props },
	ref
) {
	styles.useVariants({ spacing, rounded });

	return (
		<View ref={ref} {...props} style={[SHADOWS[elevation.toString()], styles.paper]}>
			{children}
		</View>
	);
}) as <TElement extends ElementType = typeof View>(props: PaperProps<TElement>) => ReactNode;

const styles = StyleSheet.create(theme => ({
	paper: {
		backgroundColor: theme.colors.background.paper,
		color: theme.colors.text.primary,
		variants: {
			spacing: {
				normal: {
					padding: theme.spacing(3),
				},
				dense: {
					padding: theme.spacing(1),
				},
				disabled: {
					padding: 0,
				},
			},
			rounded: {
				true: {
					borderRadius: theme.borderRadius(3),
				},
				false: {
					borderRadius: 0,
				},
			},
		},
	},
}));

export default Paper;
