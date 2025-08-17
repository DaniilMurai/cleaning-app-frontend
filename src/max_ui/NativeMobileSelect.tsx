import Typography from "@/ui/common/Typography";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	ActionSheetIOS,
	FlatList,
	Modal,
	Platform,
	StyleSheet as NativeStyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface Option {
	label: string;
	value: string | number;
}

interface NativeMobileSelectProps {
	options: Option[];
	selectedValue: string | number | undefined;
	onValueChange: (value: string | number) => void;
	cancelLabel: string;
	placeholder?: string;
}

export const NativeMobileSelect: React.FC<NativeMobileSelectProps> = ({
	options,
	selectedValue,
	onValueChange,
	placeholder = "Please select an option",
	cancelLabel,
}) => {
	const { theme } = useUnistyles();
	const [visible, setVisible] = useState(false);

	const showIOS = () => {
		const labels = options.map(o => o.label).concat(cancelLabel);
		ActionSheetIOS.showActionSheetWithOptions(
			{ options: labels, cancelButtonIndex: labels.length - 1 },
			idx => {
				if (idx < options.length) {
					onValueChange(options[idx].value);
				}
			}
		);
	};

	const handlePress = () => {
		if (Platform.OS === "ios") {
			showIOS();
		} else {
			setVisible(true);
		}
	};

	if (Platform.OS === "web") return <Typography>Not supported</Typography>;

	return (
		<>
			<TouchableOpacity style={styles.input} onPress={handlePress}>
				<Text style={styles.buttonText}>
					{options.find(o => o.value === selectedValue)?.label || placeholder}
				</Text>
				<MaterialIcons
					name="keyboard-arrow-down"
					size={24}
					color={theme.colors.secondary.main}
				/>
			</TouchableOpacity>

			{Platform.OS === "android" && (
				<Modal
					visible={visible}
					transparent
					animationType="fade"
					onRequestClose={() => setVisible(false)}
				>
					<TouchableWithoutFeedback onPress={() => setVisible(false)}>
						<View style={styles.backdrop} />
					</TouchableWithoutFeedback>
					<View style={styles.modal}>
						<FlatList
							data={options}
							keyExtractor={item => String(item.value)}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.item}
									onPress={() => {
										onValueChange(item.value);
										setVisible(false);
									}}
								>
									<Text style={styles.itemText}>{item.label}</Text>
								</TouchableOpacity>
							)}
						/>
					</View>
				</Modal>
			)}
		</>
	);
};

const styles = StyleSheet.create(theme => ({
	input: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: theme.borderRadius(3),
		borderColor: theme.colors.components.input.border,
		backgroundColor: theme.colors.components.input.background,
	},
	buttonText: {
		fontSize: 16,
		color: theme.colors.text.primary,
	},
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},
	modal: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		maxHeight: "50%",
		// backgroundColor: theme.colors.background.modal,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	item: {
		paddingVertical: theme.spacing(1.5),
		paddingHorizontal: theme.spacing(4),
		borderBottomWidth: NativeStyleSheet.hairlineWidth,
		borderColor: theme.colors.divider,
	},
	itemText: {
		fontSize: 16,
		fontWeight: "500",
		color: theme.colors.text.primary,
	},
}));
