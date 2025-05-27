// src/components/common/ModalContainer.tsx
import { Modal, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import React from "react";

interface ModalContainerProps {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function ModalContainer({ visible, onClose, children }: ModalContainerProps) {
	return (
		<Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>{children}</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create(theme => ({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)",
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing(2),
	},
	modalContent: {
		width: "100%",
		maxWidth: 600,
	},
}));
