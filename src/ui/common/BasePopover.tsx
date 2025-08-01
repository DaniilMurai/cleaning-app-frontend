import React, { cloneElement, isValidElement, ReactElement, ReactNode, useState } from "react";
import { Pressable, ScrollView, View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface BasePopoverProps extends ViewProps {
	trigger: ReactElement;
	children: ReactNode;
	itemHeight?: number;
	maxItemVisible?: number;
	maxHeight?: number;
	closeOnItemPress?: boolean;
	isScrolled?: boolean;
	maxWidth?: number;
}

export default function BasePopover({
	trigger,
	children,
	itemHeight = 56,
	maxItemVisible = 4,
	maxHeight,
	closeOnItemPress = false,
	isScrolled = true,
	maxWidth,
	...props
}: BasePopoverProps) {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const height = useSharedValue(0);
	const opacity = useSharedValue(0);

	const calculatedHeight =
		React.Children.count(children) < maxItemVisible
			? itemHeight * React.Children.count(children)
			: itemHeight * maxItemVisible;

	const toggle = () => {
		const open = !isVisible;
		setIsVisible(open);
		height.value = withTiming(open ? calculatedHeight : 0, { duration: 200 });
		opacity.value = withTiming(open ? 1 : 0, { duration: 150 });
	};
	const close = () => {
		setIsVisible(false);
		height.value = withTiming(0, { duration: 200 });
		opacity.value = withTiming(0, { duration: 150 });
	};

	const animatedStyle = useAnimatedStyle(() => ({
		height: height.value,
		opacity: opacity.value,
	}));

	const enhancedChildren = closeOnItemPress
		? React.Children.map(children, child => {
				if (!React.isValidElement(child)) return child;

				const element = child as ReactElement<{ onPress?: (...args: any[]) => void }>;

				const originalOnPress = element.props.onPress;

				return cloneElement(element, {
					onPress: (...args: any[]) => {
						originalOnPress?.(...args);
						close();
					},
				});
			})
		: children;

	return (
		<View {...props} style={[styles.container, { zIndex: isVisible ? 10000 : 1 }]}>
			{isValidElement(trigger) && typeof trigger.type !== "string" ? (
				cloneElement(trigger as ReactElement<any>, { onPress: toggle })
			) : (
				<Pressable onPress={toggle}>{trigger}</Pressable>
			)}

			<Animated.View
				style={[
					styles.popover,
					animatedStyle,
					{
						minWidth: maxWidth ?? 300,
						alignSelf: "flex-start",
						zIndex: 10000, // Добавлено
					},
				]}
			>
				{isScrolled ? (
					<ScrollView contentContainerStyle={styles.content}>
						{enhancedChildren}
					</ScrollView>
				) : (
					<View style={styles.content}>{enhancedChildren}</View>
				)}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		position: "relative",
	},
	popover: {
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,
		backgroundColor: theme.colors.background.paper,
		borderRadius: 8,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: theme.colors.border,
		elevation: 10, // Увеличенное значение для Android
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 }, // Увеличенный offset
		shadowOpacity: 0.3, // Более заметная тень
		shadowRadius: 6, // Увеличенный радиус
	},
	content: {
		paddingVertical: 8,
	},
}));
