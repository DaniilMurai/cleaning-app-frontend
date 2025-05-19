import Paper, { PaperProps } from "@/ui/Paper";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import { UnistylesRuntime } from "react-native-unistyles";
import { NativeMethods } from "react-native/types/public/ReactNativeTypes";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";
import { Portal } from "@/features/Portal";
import usePopperInsets from "./usePopperInsets";

type RectType = Partial<Record<"top" | "bottom" | "left" | "right", number>>;

export interface PopperProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	anchorEl?: NativeMethods | null;
	contentPosition?: ["top" | "bottom" | "center", "left" | "right" | "center"];
	anchorPosition?: ["top" | "bottom" | "center", "left" | "right" | "center"];
	anchorOffset?: [number, number];
	rect?: RectType;
	children?: ReactNode;
	disablePaper?: boolean;
	paperProps?: PaperProps<Animated.View>;
	wrapperProps?: ViewProps;
	measureMinusInsetTopAndroid?: boolean;
	onShowing?: () => void;
	onShown?: () => void;
	onHiding?: () => void;
	onHidden?: () => void;
	topDelta?: number;
	leftDelta?: number;
	animateByYAxis?: boolean;
}

export default function Popper({
	visible,
	setVisible,
	rect,
	children,
	anchorEl,
	contentPosition = ["bottom", "left"],
	anchorPosition = ["bottom", "right"],
	anchorOffset = [0, 0],
	disablePaper,
	paperProps,
	wrapperProps,
	onShowing,
	onShown,
	onHiding,
	onHidden,
	topDelta = 0,
	leftDelta = 0,
	animateByYAxis,
}: PopperProps) {
	const animation = useSharedValue(0);
	const [position, setPosition] = useState<RectType | undefined>(rect);

	const [openReady, setOpenReady] = useState(false);
	const [internalVisible, setInternalVisible] = useState<boolean>(false);
	const [childLayout, setChildLayout] = useState({
		width: 0,
		height: 0,
	});
	const [transformOrigin, setTransformOrigin] = useState<string | Array<number | string>>(
		"top right"
	);

	const [anchorPositionVertical, anchorPositionHorizontal] = anchorPosition;
	const [contentPositionVertical, contentPositionHorizontal] = contentPosition;
	const [offsetVertical_, offsetHorizontal_] = anchorOffset;

	const popperInsets = usePopperInsets();

	const offsetVertical = offsetVertical_ - popperInsets.top - popperInsets.bottom;
	const offsetHorizontal = offsetHorizontal_ - popperInsets.left - popperInsets.right;

	useEffect(() => {
		if (!visible) return;

		if (!anchorEl) {
			setOpenReady(true);
			setPosition(rect);
			setTransformOrigin("top right");
			return;
		}

		if (!childLayout.width && !childLayout.height) return;

		anchorEl.measure((_x, _y, width, height, pageX, pageY) => {
			const screenInnerWidth =
				UnistylesRuntime.screen.width -
				UnistylesRuntime.insets.left -
				UnistylesRuntime.insets.right;
			const screenInnerHeight =
				UnistylesRuntime.screen.height -
				Platform.select({
					ios: 0,
					default: UnistylesRuntime.insets.top,
				}) -
				Platform.select({
					default: UnistylesRuntime.insets.bottom,
					android: 0,
				});

			let initialTop: number = pageY + offsetVertical;
			let initialLeft: number = pageX + offsetHorizontal;
			let top: number;
			let left: number;

			if (contentPositionVertical === "top") {
				initialTop -= childLayout.height;
			} else if (contentPositionVertical === "center") {
				initialTop -= childLayout.height - height;
			}
			if (anchorPositionVertical === "bottom") {
				initialTop += height;
			} else if (anchorPositionVertical === "center") {
				initialTop += height / 2;
			}

			top = initialTop;
			if (top < 0) {
				top = 0;
			} else if (top + childLayout.height > screenInnerHeight) {
				top = Math.max(0, screenInnerHeight - childLayout.height);
			}

			if (contentPositionHorizontal === "left") {
				initialLeft -= childLayout.width;
			} else if (contentPositionHorizontal === "center") {
				initialLeft -= childLayout.width / 2;
			}
			if (anchorPositionHorizontal === "right") {
				initialLeft += width;
			} else if (anchorPositionHorizontal === "center") {
				initialLeft += width / 2;
			}

			left = initialLeft;
			if (left < 0) {
				left = 0;
			} else if (left + childLayout.width > screenInnerWidth) {
				left = Math.max(0, screenInnerWidth - childLayout.width);
			}

			let transformOriginVertical = initialTop - top;
			let transformOriginHorizontal = initialLeft - left;

			if (contentPositionVertical === "top") {
				transformOriginVertical += childLayout.height;
			} else if (contentPositionVertical === "center") {
				transformOriginVertical += childLayout.height / 2;
			}

			if (contentPositionHorizontal === "left") {
				transformOriginHorizontal += childLayout.width;
			} else if (contentPositionHorizontal === "center") {
				transformOriginHorizontal += childLayout.width / 2;
			}

			if (topDelta) top -= topDelta;
			if (leftDelta) left += leftDelta;

			setOpenReady(true);
			setPosition({ top, left });
			setTransformOrigin([transformOriginHorizontal, transformOriginVertical, 0]);
		});
	}, [
		anchorEl,
		anchorPositionHorizontal,
		anchorPositionVertical,
		childLayout.height,
		childLayout.width,
		contentPositionHorizontal,
		contentPositionVertical,
		offsetHorizontal,
		offsetVertical,
		rect,
		visible,
		topDelta,
		leftDelta,
	]);

	useEffect(() => {
		if (!visible && openReady) {
			setOpenReady(false);
		}
	}, [openReady, visible]);

	useEffect(() => {
		if (visible) {
			setInternalVisible(true);
		}
		if (!visible || openReady) {
			if (visible && onShowing) {
				onShowing();
			} else if (!visible && onHiding) {
				onHiding();
			}
			const onFinished = () => {
				if (!visible) {
					setInternalVisible(false);
				}

				if (visible && onShown) {
					onShown();
				} else if (!visible && onHidden) {
					onHidden();
				}
			};

			animation.value = withTiming(
				+visible,
				{
					duration: 250,
				},
				finished => {
					if (finished) {
						runOnJS(onFinished)();
					}
				}
			);
		}
	}, [animation, onHidden, onHiding, onShowing, onShown, openReady, visible]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: animation.value,
		transform: animateByYAxis
			? [{ translateY: (1 - animation.value) * -10 }]
			: [{ scale: animation.value }],
	}));

	const onClose = useCallback(() => {
		setVisible(false);
	}, [setVisible]);

	if (!internalVisible) return null;

	return (
		<Portal>
			<View
				style={[
					StyleSheet.absoluteFill,
					{
						position: "absolute",
					},
				]}
			>
				<OutsidePressHandler
					disabled={!visible}
					onOutsidePress={onClose}
					{...wrapperProps}
					style={[
						{
							...position,
							position: "absolute",
						},
						wrapperProps?.style,
					]}
				>
					{disablePaper ? (
						<Animated.View
							onLayout={
								visible
									? ({ nativeEvent }) => setChildLayout(nativeEvent.layout)
									: undefined
							}
							style={[
								{
									transformOrigin: transformOrigin,
								},
								animatedStyle,
							]}
						>
							{children}
						</Animated.View>
					) : (
						<Paper
							onLayout={
								visible
									? ({ nativeEvent }) => setChildLayout(nativeEvent.layout)
									: undefined
							}
							component={Animated.View}
							elevation={10}
							{...paperProps}
							style={[
								animatedStyle,
								{ transformOrigin: "top right" },
								paperProps?.style,
							]}
						>
							{children}
						</Paper>
					)}
				</OutsidePressHandler>
			</View>
		</Portal>
	);
}
