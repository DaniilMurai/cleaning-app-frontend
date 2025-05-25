import { View } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { forwardRef, PropsWithChildren, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native-unistyles";

export type CollapseVariant = "default" | "bordered";

export interface CollapseProps {
	expanded?: boolean;
	animationDuration?: number;
	variant?: "bordered";
}

const Collapse = forwardRef<View, PropsWithChildren<CollapseProps>>(function Collapse(
	{ children, expanded, animationDuration = 100, variant },
	ref
) {
	const isSetExpandedByDefaultRef = useRef(expanded);
	const [isClosed, setIsClosed] = useState(!expanded);

	const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
	const animatedHeight = useSharedValue(0);
	const animatedOpacity = useSharedValue(expanded ? 1 : 0);

	styles.useVariants({
		variant,
	});

	useEffect(() => {
		if (contentHeight) {
			if (isSetExpandedByDefaultRef.current) {
				animatedHeight.value = contentHeight;
				animatedOpacity.value = 1;
				isSetExpandedByDefaultRef.current = false;
				return;
			}
			const onFinished = () => {
				if (expanded) {
					setIsClosed(false);
				} else {
					setIsClosed(true);
				}
			};

			// Анимируем высоту
			animatedHeight.value = withTiming(
				expanded ? contentHeight : 0,
				{
					duration: animationDuration,
				},
				finished => {
					if (finished) {
						runOnJS(onFinished)();
					}
				}
			);

			// Анимируем прозрачность
			animatedOpacity.value = withTiming(expanded ? 1 : 0, {
				duration: animationDuration,
			});
		}
	}, [animatedHeight, animatedOpacity, animationDuration, contentHeight, expanded]);

	const containerStyle = useAnimatedStyle(() => ({
		height: contentHeight === undefined ? (expanded ? "auto" : 0) : animatedHeight.value,
	}));

	const contentStyle = useAnimatedStyle(() => ({
		opacity: animatedOpacity.value,
	}));

	return (
		<Animated.View style={[containerStyle, styles.container]}>
			<Animated.View
				style={[
					contentStyle,
					styles.content,
					{ display: contentHeight === undefined && !expanded ? "none" : "flex" },
				]}
			>
				<View
					ref={ref}
					style={styles.contentInner}
					onLayout={({ nativeEvent }) => {
						const newHeight = nativeEvent.layout.height;
						if (newHeight > 0 && newHeight !== contentHeight) {
							setContentHeight(newHeight);
						}
					}}
				>
					{children}
				</View>
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
		},
	},
	content: {
		width: "100%",
	},
	contentInner: {
		width: "100%",
		flexDirection: "column",
	},
}));

export default Collapse;
