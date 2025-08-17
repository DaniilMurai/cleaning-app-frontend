import { TextProps, View, ViewProps } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { useState } from "react";

export type DividerProps = ViewProps & {
	textProps?: TextProps;
	textWrapperProps?: ViewProps;
};

const Divider = withUnistyles(function Divider({
	children,
	textWrapperProps,
	...props
}: DividerProps) {
	const [dividerWidth, setDividerWidth] = useState(0);
	const [dividerTextLayout, setDividerTextLayout] = useState({
		width: 0,
		height: 0,
	});

	return (
		<View
			{...props}
			style={[styles.divider, props.style]}
			onLayout={({ nativeEvent }) => {
				setDividerWidth(nativeEvent.layout.width);
			}}
		>
			<View
				{...textWrapperProps}
				style={[
					styles.dividerTextContainer,
					{
						transform: [
							{
								translateY: -dividerTextLayout.height * 1.75,
							},
							{
								translateX: dividerWidth / 2 - dividerTextLayout.width / 2,
							},
						],
					},
					props.style,
				]}
				onLayout={({ nativeEvent }) => {
					setDividerTextLayout(nativeEvent.layout);
				}}
			>
				{children}
			</View>
		</View>
	);
});

export default Divider;

const styles = StyleSheet.create(theme => ({
	divider: {
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.divider,
	},
	dividerTextContainer: {
		position: "absolute",
		backgroundColor: theme.colors.background.paper,
		paddingHorizontal: theme.spacing(1.5),
	},
}));
