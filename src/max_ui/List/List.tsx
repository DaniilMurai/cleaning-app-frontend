import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function List({ rounded, ...props }: ViewProps & { rounded?: boolean }) {
	styles.useVariants({ rounded });

	return (
		<View {...props} style={[styles.container, props.style]}>
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		backgroundColor: theme.colors.background.paper,
		paddingVertical: theme.spacing(1),
		...theme.shadow(3),
		variants: {
			rounded: {
				true: {
					borderRadius: theme.borderRadius(3),
				},
			},
		},
	},
}));
