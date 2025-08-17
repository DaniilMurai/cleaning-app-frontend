import Button, { ButtonProps } from "@/ui/common/Button";
import { StyleSheet } from "react-native-unistyles";

export default function ListItem(props: ButtonProps) {
	return (
		<Button
			// fullWidth
			color={"secondary"}
			style={styles.mainButton}
			{...props}
			// slotProps={{
			// 	...props.slotProps,
			// 	text: {
			// 		...props.slotProps?.text,
			// 		style: props.slotProps?.text?.style
			// 			? [styles.buttonText, props.slotProps?.text?.style]
			// 			: styles.buttonText,
			// 	},
			// }}
		/>
	);
}

const styles = StyleSheet.create({
	buttonText: {
		textTransform: "none",
		textAlign: "left",
	},
	mainButton: {
		borderRadius: 0,
		justifyContent: "flex-start",
		alignItems: "center",
	},
});
