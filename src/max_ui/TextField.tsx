import {
	Animated,
	CursorValue,
	Platform,
	Pressable,
	PressableProps,
	StyleProp,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewProps,
	ViewStyle,
} from "react-native";
import type * as React from "react";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export interface TextFieldProps extends Omit<TextInputProps, "value" | "onChangeText"> {
	label?: ReactNode;
	value?: string;
	onChangeText?: (value: string) => void;
	fullWidth?: boolean;
	variant?: "outlined";
	inputRef?: RefObject<TextInput | null>;
	size?: "small" | "medium";
	errorMessage?: string;
	hasError?: boolean;
	adornmentNode?: ReactNode;
	containerProps?: ViewProps;
	wrapperProps?: PressableProps & React.RefAttributes<View>;
}

export default function TextField({
	label,
	value,
	onChangeText,
	fullWidth = true,
	variant = "outlined",
	inputRef: inputRefProps,
	size = "medium",
	containerProps,
	wrapperProps,
	errorMessage,
	hasError = false,
	adornmentNode,
	...inputProps
}: TextFieldProps) {
	const inputRefLocal = useRef<TextInput>(null);
	const inputRef = inputRefProps || inputRefLocal;

	const [isFocused, setIsFocused] = useState<boolean>(false);

	const { theme } = useUnistyles();
	styles.useVariants({ fullWidth, variant, size });
	const moveLabelUp = isFocused || !!value;

	const [labelLayout, setLabelLayout] = useState({
		width: 0,
		height: 0,
	});
	const [containerHeight, setContainerHeight] = useState(0);

	const labelAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		labelAnim.stopAnimation(() => {
			Animated.timing(labelAnim, {
				toValue: moveLabelUp ? 1 : 0,
				duration: 100,
				useNativeDriver: Platform.OS !== "web",
			}).start();
		});
	}, [labelAnim, moveLabelUp]);

	const labelHeight = labelLayout.height;

	const inputWrapperStyle = styles.inputWrapper(!!label);

	useEffect(() => {
		if (Platform.OS === "web") {
			console.log("input", inputRef.current);
		}
	}, [inputRef]);

	return (
		<>
			<View
				tabIndex={-1}
				onLayout={({ nativeEvent }) => setContainerHeight(nativeEvent.layout.height)}
				{...containerProps}
				style={[
					styles.container,
					containerProps?.style,
					...(errorMessage || hasError ? [{ borderColor: theme.colors.error.main }] : []),
					Platform.select({
						web: isFocused
							? ({
									outlineStyle: "solid",
									outlineWidth: "2px",
									outlineOffset: "-2px",
									outlineColor:
										errorMessage?.length || hasError
											? theme.colors.error.main
											: theme.colors.components.input.outline,
								} as unknown as StyleProp<ViewStyle>)
							: undefined,
					}),
				]}
			>
				{label && (
					<Animated.View
						tabIndex={-1}
						onLayout={({ nativeEvent }) => setLabelLayout(nativeEvent.layout)}
						style={[
							styles.labelContainer,
							{
								transform: [
									{
										translateY: labelAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [
												containerHeight / 2 - labelHeight / 2 - 1,
												containerHeight / 2 - labelHeight,
												// -(labelHeight * 0.05),
											],
										}),
									},
									{
										scale: labelAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [1, 0.75],
										}),
									},
								],
							},
						]}
					>
						<Text numberOfLines={1} style={styles.labelText}>
							{label}
						</Text>
					</Animated.View>
				)}
				<Pressable
					tabIndex={-1}
					onPress={() => {
						if (!inputRef.current?.isFocused()) {
							inputRef.current?.focus();
						}
					}}
					{...wrapperProps}
					style={
						typeof wrapperProps?.style === "function"
							? state => [
									inputWrapperStyle,
									typeof wrapperProps?.style === "function" &&
										wrapperProps?.style(state),
								]
							: [inputWrapperStyle, wrapperProps?.style]
					}
				>
					<TextInput
						ref={inputRef}
						autoFocus={false}
						value={value}
						cursorColor={theme.colors.primary.main}
						selectionColor={Platform.select({
							android: theme.colors.primary.main + "50",
							default: theme.colors.primary.main,
						})}
						onChangeText={onChangeText}
						placeholderTextColor={theme.colors.text.disabled["500"]}
						// @ts-expect-error Prop for web
						rows={inputProps?.numberOfLines ? inputProps?.numberOfLines : 1}
						{...inputProps}
						style={[
							styles.input,
							{
								outlineStyle: "none" as ViewStyle["outlineStyle"],
								minWidth: labelLayout.width,
							},
							inputProps.style,
						]}
						onFocus={event => {
							setIsFocused(true);
							if (inputProps.selectTextOnFocus && value?.length) {
								console.log("setting selection");
								inputRef.current?.setNativeProps({
									selection: { start: 0, end: value.length },
								});
							}
							inputProps?.onFocus && inputProps.onFocus(event);
						}}
						onBlur={event => {
							setIsFocused(false);
							inputProps?.onBlur && inputProps.onBlur(event);
						}}
					/>
					{adornmentNode && adornmentNode}
				</Pressable>
			</View>

			{errorMessage?.length && (
				<Text numberOfLines={1} style={styles.errorText}>
					{errorMessage}
				</Text>
			)}
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		overflow: "hidden",
		flexDirection: "row",
		variants: {
			fullWidth: {
				true: {
					alignSelf: "stretch",
				},
				default: {
					alignSelf: "baseline",
				},
			},
			variant: {
				outlined: {
					backgroundColor: theme.colors.components.input.background,
					borderRadius: theme.borderRadius(3),
					borderWidth: 1,
					borderColor: theme.colors.components.input.border,
				},
			},
		},
	},
	labelContainer: {
		left: theme.spacing(2),
		zIndex: 2,
		position: "absolute",
		alignSelf: "baseline",
		top: 0,
		pointerEvents: "none",
		transformOrigin: "left top",
	},
	labelText: {
		userSelect: "none",
		alignSelf: "baseline",
		color: theme.colors.text.secondary,
		fontWeight: "300",
		fontSize: 16,
	},
	errorText: {
		userSelect: "none",
		alignSelf: "baseline",
		color: theme.colors.error.main,
		fontWeight: "200",
		fontSize: 12,
		whiteSpace: "wrap",
		marginTop: theme.spacing(0.5),
	},
	inputWrapper: (isLabel: boolean) => ({
		cursor: Platform.select({
			web: "text" as CursorValue,
		}),
		flexDirection: "row",
		outlineStyle: "none" as ViewStyle["outlineStyle"],
		alignItems: "center",
		paddingHorizontal: theme.spacing(2),
		variants: {
			fullWidth: {
				true: {
					flexGrow: 1,
				},
			},
			size: {
				small: {
					paddingTop: theme.spacing(isLabel ? 2 : 1),
					paddingBottom: theme.spacing(1),
				},
				medium: {
					paddingTop: theme.spacing(isLabel ? 3.5 : 1.75),
					paddingBottom: theme.spacing(1.75),
				},
			},
		},
	}),
	input: {
		flex: 1,
		padding: 0,
		color: theme.colors.text.primary,
		fontSize: 16,
	},
}));
