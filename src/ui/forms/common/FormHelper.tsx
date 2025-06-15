import { StyleSheet } from "react-native-unistyles";
import { Typography } from "@/ui";
import { TypographyProps } from "@/ui/common/Typography";

export default function FormHelper(props: TypographyProps) {
	return <Typography {...props} style={[styles.formHelper, props.style]} />;
}

const styles = StyleSheet.create(theme => ({
	formHelper: {
		marginVertical: theme.spacing(0.5),
	},
}));
