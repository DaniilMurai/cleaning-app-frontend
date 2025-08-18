import { forwardRef, ReactNode } from "react";
import { Text } from "react-native";
import PlatformExt from "@/features/PlatformExt.ts";
import { StyleSheet } from "react-native-unistyles";
import Typography, { TypographyProps } from "@/ui/common/Typography";

export interface DialogTitleProps extends TypographyProps {
	children?: ReactNode;
}

const DialogTitle = forwardRef<Text, DialogTitleProps>(
	({ children, ...props }: DialogTitleProps, ref) => {
		return (
			<Typography ref={ref} variant={"h6"} {...props} style={[styles.text, props.style]}>
				{children}
			</Typography>
		);
	}
);

export default DialogTitle;

const styles = StyleSheet.create(theme => ({
	text: {
		fontWeight: "600",
		paddingHorizontal: theme.spacing(3),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(0.5),
		textAlign: PlatformExt.select({ apple: "center", default: "left" }),
	},
}));
