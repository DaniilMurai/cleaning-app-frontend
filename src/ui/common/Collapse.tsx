import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { forwardRef, PropsWithChildren, useEffect, useRef } from "react";
import { StyleSheet } from "react-native-unistyles";

export type CollapseVariant = "default" | "bordered";

export interface CollapseProps {
	expanded?: boolean;
	animationDuration?: number;
	variant?: "bordered";
}

const Collapse = forwardRef<View, PropsWithChildren<CollapseProps>>(function Collapse(
	{ children, expanded = false, animationDuration = 100, variant },
	ref
) {
	const isSetExpandedByDefaultRef = useRef(expanded);

	const contentHeight = useSharedValue<number | undefined>(undefined);

	const animatedHeight = useSharedValue<number | undefined>(undefined);
	const animatedOpacity = useSharedValue(expanded ? 1 : 0);

	styles.useVariants({
		variant,
		expanded,
	});

	useEffect(() => {
		if (isSetExpandedByDefaultRef.current) {
			animatedHeight.value = contentHeight.value;
			animatedOpacity.value = 1;
			isSetExpandedByDefaultRef.current = false;
			return;
		}

		animatedHeight.value = withTiming(expanded ? contentHeight.value || 0 : 0, {
			duration: animationDuration,
		});

		animatedOpacity.value = withTiming(expanded ? 1 : 0, {
			duration: animationDuration,
		});
	}, [animatedHeight, animatedOpacity, animationDuration, expanded]);

	const containerStyle = useAnimatedStyle(() => ({
		height: animatedHeight.value,
	}));

	const contentStyle = useAnimatedStyle(() => ({
		opacity: animatedOpacity.value,
	}));

	return (
		<Animated.View style={[containerStyle, styles.container]}>
			<Animated.View
				ref={ref}
				style={[contentStyle, styles.content]}
				onLayout={({ nativeEvent: { layout } }) => {
					contentHeight.value = layout.height;
					if (expanded) {
						animatedHeight.value = layout.height;
					}
				}}
			>
				{children}
			</Animated.View>
		</Animated.View>
	);
});

const styles = StyleSheet.create(theme => ({
	container: {
		overflow: "hidden",
		variants: {
			variant: {
				default: {},
				bordered: {
					borderWidth: 1,
					borderColor: theme.colors.divider,
					borderRadius: theme.borderRadius(1),
				},
			},
			expanded: {
				true: { display: "flex" },
				false: { display: "none" },
			},
		},
	},
	content: {
		width: "100%",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	contentInner: {
		width: "100%",
		flexDirection: "column",
	},
}));

export default Collapse;
