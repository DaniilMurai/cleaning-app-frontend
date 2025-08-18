import { PressableProps, View, ViewProps } from "react-native";
import { forwardRef, Fragment, ReactNode, RefObject, useState } from "react";
import PlatformExt from "@/features/PlatformExt.ts";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/ui";
import { ButtonColor, ButtonProps, ButtonVariant } from "@/ui/common/Button.tsx";

// import Button, { ButtonProps, ButtonVariant } from "@/ui/Button.tsx";

export interface DialogActionType {
	text: string;
	variant?: ButtonVariant; // web only
	color?: ButtonColor;
	isPreferred?: boolean; // apple only
	disabled?: boolean;
	onPress?: PressableProps["onPress"];
	loading?: boolean; // not native alerts only
	// loadingPosition?: ButtonProps["loadingPosition"];
	buttonProps?: ButtonProps;
}

export type DialogActionsProps = ViewProps & {
	ref?: RefObject<View>;
	actions?: DialogActionType[];
};

const DialogActions: (props: DialogActionsProps) => ReactNode = forwardRef<
	View,
	DialogActionsProps
>(({ actions, ...props }, ref) => {
	return (
		<View ref={ref} {...props} style={[styles.container, props.style]}>
			{actions?.map((action, i) => (
				<DialogActionButton key={action.text} action={action} i={i} />
			))}
		</View>
	);
});

function DialogActionButton({ action, i }: { action: DialogActionType; i: number }) {
	const [loading, setLoading] = useState(false);

	return (
		<Fragment key={action.text}>
			{i > 0 && PlatformExt.isApple && <View style={styles.fragmentWrapper} />}
			<View
				key={action.text}
				style={{
					flex: 1,
					alignSelf: "stretch",
				}}
			>
				<Button
					color={action.color}
					onPress={async event => {
						setLoading(true);
						try {
							if (action.onPress) {
								await Promise.resolve(action.onPress(event));
							}
						} finally {
							setLoading(false);
						}
					}}
					// fullWidth={PlatformExt.isApple}
					{...action.buttonProps}
					disabled={action.disabled}
					loading={action.loading || loading}
					// style={
					// 	action.buttonProps?.style
					// 		? [styles.button, action.buttonProps?.style]
					// 		: styles.button
					// }
					// loadingPosition={action.loadingPosition}
				>
					{action.text}
				</Button>
			</View>
		</Fragment>
	);
}

export default DialogActions;

const styles = StyleSheet.create(theme => ({
	container: {
		flexDirection: "row",
		flexWrap: PlatformExt.select({ apple: undefined, default: "wrap" }),
		borderTopWidth: PlatformExt.select({ apple: 1 }),
		borderTopColor: theme.colors.divider,
		justifyContent: PlatformExt.select({ apple: "center", default: "flex-end" }),
		paddingHorizontal: PlatformExt.select({ apple: 0, default: theme.spacing(2) }),
		paddingTop: PlatformExt.select({ apple: 0, default: theme.spacing(1.5) }),
		paddingBottom: PlatformExt.select({ apple: 0, default: theme.spacing(2) }),
		marginTop: PlatformExt.select({ apple: theme.spacing(0.5) }),
	},
	fragmentWrapper: {
		borderLeftWidth: 1,
		borderLeftColor: theme.colors.divider,
	},
	button: {
		paddingVertical: PlatformExt.select({
			apple: theme.spacing(1),
			default: theme.spacing(0.75),
		}),
		borderRadius: PlatformExt.select({
			apple: 0,
			default: theme.borderRadius(3),
		}),
	},
}));
