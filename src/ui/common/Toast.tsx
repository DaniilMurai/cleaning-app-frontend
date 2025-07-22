import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/common/Typography";
import { ReactNode } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface ToastProps {
	children?: ReactNode;
	show?: boolean;
	height?: number;
	width?: number;
}

export default function Toast({ children, show, height = 120, width = 300 }: ToastProps) {
	if (!show) return;
	const offset = useSharedValue(0);
	const opacity = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: offset.value }],
		opacity: opacity.value,
	}));
	offset.value = withTiming(-70, { duration: 500 });
	setTimeout(() => {
		opacity.value = withTiming(0, { duration: 1500 });
	}, 1200);

	return (
		<Animated.View style={[styles.container, animatedStyle, { height: height, width: width }]}>
			<Typography>some text</Typography>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		position: "absolute",
		bottom: -50,
		right: 20,
		zIndex: 99999,
		backgroundColor: theme.colors.background.paper,
		borderWidth: 1,
		borderRadius: theme.borderRadius(2),
		borderColor: theme.colors.border,
	},
}));
