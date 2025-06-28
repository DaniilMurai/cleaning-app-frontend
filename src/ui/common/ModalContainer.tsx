// src/components/common/ModalContainer.tsx
import { Modal, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React from "react";
import { BlurView } from "expo-blur";

interface ModalContainerProps extends React.ComponentProps<typeof Modal> {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function ModalContainer({ visible, onClose, children }: ModalContainerProps) {
	return (
		<Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
			<BlurView intensity={20} tint="dark" style={styles.blurView}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>{children}</View>
				</View>
			</BlurView>
		</Modal>
	);
}

const styles = StyleSheet.create(theme => ({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.1)",
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing(2),
	},
	blurView: {
		flex: 1,
		_web: {
			maxHeight: "100vh",
		},
	},
	modalContent: {
		width: "100%",
		maxWidth: 600,
	},
}));
