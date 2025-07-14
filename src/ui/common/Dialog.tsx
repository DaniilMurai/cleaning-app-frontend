// src/components/common/ModalContainer.tsx
import { Modal, ScrollView, ScrollViewProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React, { ReactNode } from "react";
import { UniBlurView } from "@/ui/uni";
import { AppBreakpoint } from "@/unistyles";
import Card, { CardProps } from "@/ui/common/Card";

export interface DialogProps extends React.ComponentProps<typeof Modal> {
	visible: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	maxWidth?: AppBreakpoint;
	fullWidth?: boolean;
	card?: boolean;
	cardProps?: CardProps;
	scrollViewProps?: ScrollViewProps;
	scrollView?: boolean;
	header?: ReactNode;
	actions?: ReactNode;
}

export default function Dialog({
	visible,
	onClose,
	children,
	maxWidth = "sm",
	fullWidth = true,
	card,
	cardProps,
	scrollView,
	scrollViewProps,
	header,
	actions,
}: DialogProps) {
	const content = scrollView ? (
		<ScrollView
			{...scrollViewProps}
			contentContainerStyle={[styles.scrollContent, scrollViewProps?.contentContainerStyle]}
		>
			{children}
		</ScrollView>
	) : (
		children
	);

	styles.useVariants({ maxWidth, fullWidth });

	return (
		<Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
			<UniBlurView intensity={20} tint="dark" style={styles.blurView}>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent]}>
						{card ? (
							<Card {...cardProps} style={[styles.card, cardProps?.style]}>
								{header}
								{content}
								{actions}
							</Card>
						) : (
							<>
								{header}
								{content}
								{actions}
							</>
						)}
					</View>
				</View>
			</UniBlurView>
		</Modal>
	);
}

const styles = StyleSheet.create((theme, rt) => ({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: {
			xs: theme.spacing(2),
			sm: theme.spacing(3),
			md: theme.spacing(4),
		},
		height: "100%",
		flexDirection: "row",
	},
	blurView: {
		flex: 1,
		_web: {
			height: "100vh",
		},
	},
	modalContent: {
		display: "flex",
		alignSelf: "center",
		maxHeight: "100%",
		variants: {
			maxWidth: {
				xs: {},
				sm: {},
				md: {},
				lg: {},
				xl: {},
				xxl: {},
			},
			fullWidth: {
				true: {},
				false: {},
			},
		},
		compoundVariants: [
			{
				maxWidth: "xs",
				fullWidth: true,
				styles: {
					minWidth: Math.min(420, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(420, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "sm",
				fullWidth: true,
				styles: {
					minWidth: Math.min(theme.breakpoints.sm, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(theme.breakpoints.sm, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "md",
				fullWidth: true,
				styles: {
					minWidth: Math.min(theme.breakpoints.md, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(theme.breakpoints.md, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "lg",
				fullWidth: true,
				styles: {
					minWidth: Math.min(theme.breakpoints.lg, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(theme.breakpoints.lg, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "xl",
				fullWidth: true,
				styles: {
					minWidth: Math.min(theme.breakpoints.xl, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(theme.breakpoints.xl, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "xxl",
				fullWidth: true,
				styles: {
					minWidth: Math.min(theme.breakpoints.xxl, rt.screen.width) - theme.spacing(2),
					maxWidth: Math.min(theme.breakpoints.xxl, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "xs",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(420, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "sm",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(theme.breakpoints.sm, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "md",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(theme.breakpoints.md, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "lg",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(theme.breakpoints.lg, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "xl",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(theme.breakpoints.xl, rt.screen.width) - theme.spacing(2),
				},
			},
			{
				maxWidth: "xxl",
				fullWidth: false,
				styles: {
					maxWidth: Math.min(theme.breakpoints.xxl, rt.screen.width) - theme.spacing(2),
				},
			},
		],
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: theme.spacing(2),
	},
	card: {
		flexShrink: 1,
		variants: {
			fullWidth: {
				true: {
					width: "100%",
				},
				false: {},
			},
		},
	},
}));
