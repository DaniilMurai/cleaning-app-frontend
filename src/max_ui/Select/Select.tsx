import Popper from "@/max_ui/Popper";
import { ListItem } from "@/max_ui/List";
import { useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SelectProps } from "@/max_ui/Select/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, UnistylesRuntime, useUnistyles } from "react-native-unistyles";
import { CursorValue, FlatList, Platform, Pressable, Text, View, ViewStyle } from "react-native";

export default function Select<TValue extends string | number | undefined>({
	value,
	onChange,
	data,
	fullWidth = true,
	variant = "outlined",
	size = "medium",
	containerProps,
	wrapperProps,
	valueTextProps,
	itemProps,
	disablePaperSaveWidthAsInput,
	popperProps,
}: SelectProps<TValue>) {
	const popperAnchorRef = useRef<View>(null);
	const [popperVisible, setPopperVisible] = useState(false);

	const currentValue = useMemo(() => data.find(x => x.value === value), [data, value]);

	const { theme } = useUnistyles();
	styles.useVariants({
		variant,
		size,
		fullWidth,
	});

	const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

	const insets = useSafeAreaInsets();

	return (
		<>
			<View
				ref={popperAnchorRef}
				{...containerProps}
				onLayout={event => {
					setInputWidth(event.nativeEvent.layout.width);
					containerProps?.onLayout && containerProps.onLayout(event);
				}}
				style={[styles.container, containerProps?.style]}
			>
				<Pressable
					{...wrapperProps}
					style={[styles.inputWrapper, wrapperProps?.style]}
					onPress={() => {
						setPopperVisible(true);
					}}
				>
					<View style={{ flexGrow: 1 }}>
						<Text
							numberOfLines={1}
							{...valueTextProps}
							style={[styles.valueText, valueTextProps?.style]}
						>
							{currentValue?.label}
						</Text>
					</View>
					{!popperVisible ? (
						<Ionicons name="chevron-down" size={12} color={theme.colors.text.primary} />
					) : (
						<Ionicons name="chevron-up" size={12} color={theme.colors.text.primary} />
					)}
				</Pressable>
			</View>
			<Popper
				visible={popperVisible}
				setVisible={setPopperVisible}
				anchorEl={popperAnchorRef.current}
				contentPosition={["bottom", "right"]}
				anchorPosition={["bottom", "left"]}
				{...popperProps}
				paperProps={{
					...popperProps?.paperProps,
					style: [
						styles.paper(insets.bottom),
						disablePaperSaveWidthAsInput
							? undefined
							: {
									width: inputWidth,
								},
						popperProps?.paperProps?.style,
					],
				}}
			>
				<FlatList
					data={data}
					getItemLayout={(_, index) => ({
						length: 27,
						offset: 27 * index,
						index,
					})}
					renderItem={({ item }) => (
						<ListItem
							key={`${item.value || item.label}`}
							onPress={() => {
								onChange && onChange(item.value);
								setPopperVisible(false);
							}}
							fullWidth
							endIcon={
								value === item.value && <Ionicons name="checkmark" size={16} />
							}
							wrapInText={false}
							{...itemProps}
						>
							<View
								style={{
									flexGrow: 1,
								}}
							>
								<Text numberOfLines={1} style={styles.selectItemText}>
									{item.label}
								</Text>
							</View>
						</ListItem>
					)}
				/>
			</Popper>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		overflow: "hidden",
		alignSelf: "flex-start",
		justifyContent: "center",
		variants: {
			fullWidth: {
				true: {
					alignSelf: "stretch",
				},
				default: {
					alignSelf: "flex-start",
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
	inputWrapper: {
		cursor: Platform.select({
			web: "text" as CursorValue,
		}),
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		outlineStyle: "none" as ViewStyle["outlineStyle"],
		variants: {
			fullWidth: {
				true: {
					alignSelf: "stretch",
				},
				default: {
					alignSelf: "baseline",
				},
			},
			size: {
				small: {
					paddingHorizontal: theme.spacing(2),
					paddingTop: theme.spacing(1),
					paddingBottom: theme.spacing(1),
				},
				medium: {
					paddingHorizontal: theme.spacing(2),
					paddingTop: theme.spacing(1.75),
					paddingBottom: theme.spacing(1.75),
				},
				large: {
					paddingHorizontal: theme.spacing(2),
					paddingTop: theme.spacing(2.5),
					paddingBottom: theme.spacing(2.5),
				},
			},
		},
	},
	valueText: {
		color: theme.colors.text.primary,
		flexGrow: 1,
		fontSize: 16,
		textAlignVertical: "center",
		variants: {
			fullWidth: {
				true: {
					alignSelf: "stretch",
				},
				default: {
					alignSelf: "baseline",
				},
			},
		},
	},
	paper: (bottomInset: number) => ({
		backgroundColor: theme.colors.background.paper,
		paddingVertical: theme.spacing(1),
		paddingHorizontal: 0,
		borderRadius: theme.borderRadius(3),
		// minWidth: 80,
		maxHeight:
			(UnistylesRuntime.screen.height - UnistylesRuntime.insets.top - bottomInset) / // bottom inset from UnistylesRuntime is broken on Android;
			2,
	}),
	selectItemText: {
		fontSize: 15,
		lineHeight: 15,
		color: theme.colors.secondary.main,
	},
}));
