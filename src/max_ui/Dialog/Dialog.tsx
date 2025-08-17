import { AppBreakpoint } from "@/unistyles.ts";
import { BlurView, BlurViewProps } from "expo-blur";
import { Modal, ModalProps, NativeSyntheticEvent, Platform, View, ViewProps } from "react-native";
import { StyleSheet, UnistylesRuntime, withUnistyles } from "react-native-unistyles";
import { forwardRef, PropsWithChildren, ReactNode, useCallback } from "react";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { EventProvider } from "react-native-outside-press";
import { UniOutsidePressHandler } from "@/max_ui/uni.tsx";

export interface DialogProps extends Omit<ModalProps, "onRequestClose"> {
	visible?: boolean;
	setVisible?: (visible: boolean) => void;
	disableBackdrop?: boolean;
	backdropProps?: BlurViewProps;
	fullScreen?: boolean;
	maxWidth?: Exclude<AppBreakpoint, "xs"> | number;
	fullWidth?: boolean;
	paperProps?: ViewProps;
	PaperWrapper?: ({ children }: PropsWithChildren) => ReactNode;
	closeOnOutsidePress?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onRequestClose?: ((event?: NativeSyntheticEvent<any>) => void) | undefined;
}

const Dialog = withUnistyles(
	forwardRef<Modal, DialogProps>(
		(
			{
				setVisible,
				visible,
				disableBackdrop,
				backdropProps,
				children,
				onRequestClose: onRequestCloseProp,
				fullWidth = false,
				fullScreen = false,
				maxWidth = fullScreen ? undefined : "sm",
				PaperWrapper,
				paperProps,
				closeOnOutsidePress = true,
				...props
			},
			ref
		) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const onRequestClose = useCallback<(event?: NativeSyntheticEvent<any>) => unknown>(
				event => {
					setVisible && setVisible(false);
					onRequestCloseProp && onRequestCloseProp(event);
				},
				[onRequestCloseProp, setVisible]
			);

			const insets = useSafeAreaInsets();

			const paper = (
				<UniOutsidePressHandler
					{...paperProps}
					onOutsidePress={() => {
						if (closeOnOutsidePress) {
							onRequestClose();
						}
					}}
					style={[
						styles.paper(insets, fullScreen, fullWidth, maxWidth),
						paperProps?.style,
					]}
				>
					{children}
				</UniOutsidePressHandler>
			);

			const content = (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							justifyContent: "center",
							alignItems: "center",
						},
					]}
				>
					{PaperWrapper ? <PaperWrapper>{paper}</PaperWrapper> : paper}
				</View>
			);

			return (
				<Modal
					transparent={!fullScreen}
					ref={ref}
					visible={visible}
					onRequestClose={onRequestClose}
					supportedOrientations={[
						"portrait",
						"portrait-upside-down",
						"landscape-left",
						"landscape",
						"landscape-right",
					]}
					{...props}
				>
					<EventProvider>
						{disableBackdrop || fullScreen ? (
							content
						) : (
							<BlurView
								style={StyleSheet.absoluteFill}
								experimentalBlurMethod={"dimezisBlurView"}
								tint={"dark"}
								intensity={20}
								{...backdropProps}
							>
								{content}
							</BlurView>
						)}
					</EventProvider>
				</Modal>
			);
		}
	)
);

const styles = StyleSheet.create(theme => {
	return {
		paper: (
			insets: EdgeInsets,
			fullScreen: boolean,
			fullWidth: boolean,
			maxWidth?: Exclude<AppBreakpoint, "xs"> | number
		) => {
			const screenMaxWidthWithOffsets =
				UnistylesRuntime.screen.width - insets.left - insets.right - (fullScreen ? 0 : 16);

			const calcMaxWidth = !maxWidth
				? screenMaxWidthWithOffsets
				: Math.min(
						maxWidth in theme.breakpoints
							? Math.min(
									theme.breakpoints[maxWidth as AppBreakpoint] as number,
									screenMaxWidthWithOffsets
								)
							: (maxWidth as number),
						screenMaxWidthWithOffsets
					);

			const minWidth = calcMaxWidth && fullWidth ? calcMaxWidth : undefined;

			return {
				backgroundColor: theme.colors.background.modal,
				paddingTop: fullScreen
					? Platform.select({
							ios: insets.top,
						})
					: undefined,
				paddingBottom: fullScreen
					? Platform.select({
							ios: insets.bottom,
						})
					: undefined,
				minWidth: minWidth,
				...(Platform.OS === "web" && {
					width: minWidth,
				}),
				maxWidth: fullWidth ? undefined : calcMaxWidth,
				borderRadius: fullScreen ? 0 : theme.borderRadius(3),
				overflow: "hidden",
				...(fullScreen && {
					height: "100%",
					width: "100%",
				}),
				maxHeight:
					UnistylesRuntime.screen.height -
					Platform.select({
						android: insets.top - insets.bottom,
						default: 0,
					}) -
					(fullScreen ? 0 : theme.spacing(2)),
			};
		},
	};
});

export default Dialog;
