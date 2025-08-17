import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { forwardRef, ReactNode, RefObject } from "react";

export type DialogContentProps = ViewProps & {
	ref?: RefObject<View>;
};

const DialogContent: (props: DialogContentProps) => ReactNode = forwardRef<
	View,
	DialogContentProps
>(({ children, ...props }, ref) => {
	return (
		<View ref={ref} {...props} style={[styles.content, props.style]}>
			{children}
		</View>
	);
});

const styles = StyleSheet.create(theme => ({
	content: {
		paddingTop: theme.spacing(0.5),
		paddingHorizontal: theme.spacing(3),
		paddingBottom: theme.spacing(0.5),
	},
}));

export default DialogContent;
