import { PropsWithChildren } from "react";
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller/src/hooks";
import { Platform, useWindowDimensions } from "react-native";
import { useUnistyles } from "react-native-unistyles";

export default function KeyboardAvoidingPaperWrapper({
	children,
	behaviour = "position",
}: PropsWithChildren<{
	behaviour?: "position" | "padding";
}>) {
	const contentHeight = useSharedValue(0);
	const contentY = useSharedValue<number | null>(null);

	const keyboard = useReanimatedKeyboardAnimation();

	const { height: screenHeight } = useWindowDimensions();

	const { theme } = useUnistyles();

	const keyboardVerticalOffset = theme.spacing(2);

	const animatedStyle = useAnimatedStyle(() => {
		if (contentY.value === null || Platform.OS === "android") return {};

		const keyboardY = screenHeight + keyboard.height.value - keyboardVerticalOffset;
		const contentBottomY = contentY.value + contentHeight.value;

		const bottom =
			keyboardY < contentBottomY
				? interpolate(keyboard.progress.value, [0, 1], [0, contentBottomY - keyboardY])
				: 0;

		if (behaviour === "position") {
			return {
				transform: [
					{
						translateY: -bottom,
					},
				],
			};
		}

		return {
			paddingBottom: keyboard.progress.value ? bottom : 0,
		};
	});

	return (
		<Animated.View
			style={animatedStyle}
			onLayout={({ nativeEvent: { layout } }) => {
				contentHeight.value = layout.height;
				contentY.value = layout.y;
			}}
		>
			{children}
		</Animated.View>
	);
}
