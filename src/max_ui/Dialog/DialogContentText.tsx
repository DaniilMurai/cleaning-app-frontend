import Typography, { TypographyProps } from "@/ui/common/Typography";
import { StyleSheet } from "react-native-unistyles";
import PlatformExt from "@/features/PlatformExt.ts";

export default function DialogContentText({ children, ...props }: TypographyProps) {
	return (
		<Typography {...props} style={styles.text}>
			{children}
		</Typography>
	);
}

const styles = StyleSheet.create(theme => ({
	text: { textAlign: PlatformExt.select({ apple: "center", default: "left" }) },
}));
