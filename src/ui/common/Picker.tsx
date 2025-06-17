import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "./Typography";
import { FontAwesome5 } from "@expo/vector-icons";

export interface PickerOption {
	label: string;
	value: string;
}

interface CustomPickerProps {
	label?: string;
	value?: string;
	options: PickerOption[];
	onChange: (value: string) => void;
	style?: any;
	placeholder?: string;
}

export default function CustomPicker({
	label,
	value,
	options,
	onChange,
	style,
	placeholder = "Select option",
}: CustomPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const animationHeight = useRef(new Animated.Value(0)).current;
	const animationOpacity = useRef(new Animated.Value(0)).current;
	const selectedOption = options.find(option => option.value === value);

	useEffect(() => {
		if (isOpen) {
			const optionHeight = 56;
			const maxHeight = 4 * optionHeight;

			const calculatedHeight = options.length < 4 ? options.length * optionHeight : maxHeight;

			Animated.parallel([
				Animated.timing(animationHeight, {
					toValue: calculatedHeight,
					duration: 200,
					useNativeDriver: false,
				}),
				Animated.timing(animationOpacity, {
					toValue: 1,
					duration: 150,
					useNativeDriver: false,
				}),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(animationHeight, {
					toValue: 0,
					duration: 100,
					useNativeDriver: false,
				}),
				Animated.timing(animationOpacity, {
					toValue: 0,
					duration: 100,
					useNativeDriver: false,
				}),
			]).start();
		}
	}, [isOpen, options.length]);

	const handleSelect = (value: string) => {
		onChange(value);
		setIsOpen(false);
	};

	return (
		<View style={[styles.container, style, { zIndex: isOpen ? 1000 : 1 }]}>
			{label && (
				<Typography variant="body2" color="text.secondary" style={styles.label}>
					{label}
				</Typography>
			)}

			<Pressable
				style={state => [styles.select, state.pressed && styles.selectPressed]}
				onPress={() => setIsOpen(!isOpen)}
			>
				<Typography style={styles.selectText}>
					{selectedOption?.label || placeholder}
				</Typography>
				<FontAwesome5
					name={isOpen ? "chevron-up" : "chevron-down"}
					size={12}
					color={styles.icon.color}
				/>
			</Pressable>

			<Animated.View
				style={[
					styles.optionsContainer,
					{
						height: animationHeight,
						opacity: animationOpacity,
					},
				]}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					{options.map(option => (
						<Pressable
							key={option.value}
							style={state => [
								styles.option,
								state.pressed && styles.optionPressed,
								value === option.value && styles.selectedOption,
							]}
							onPress={() => handleSelect(option.value)}
						>
							<Typography
								style={[
									styles.optionText,
									value === option.value && styles.selectedText,
								]}
							>
								{option.label}
							</Typography>
						</Pressable>
					))}
				</ScrollView>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create(theme => ({
	container: {
		position: "relative",
		zIndex: 1,
	},
	label: {
		marginBottom: theme.spacing(0.5),
	},
	select: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: theme.colors.divider,
		borderRadius: theme.borderRadius(2),
		padding: theme.spacing(1.5),
		backgroundColor: theme.colors.background.main,
		zIndex: 2,
	},
	selectPressed: {
		opacity: 0.7,
	},
	selectText: {
		flex: 1,
		color: theme.colors.text.primary,
	},
	icon: {
		color: theme.colors.text.primary,
		marginLeft: theme.spacing(1),
	},
	optionsContainer: {
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,
		backgroundColor: theme.colors.background.paper,
		borderRadius: theme.borderRadius(1),
		borderWidth: 1,
		borderColor: theme.colors.divider,
		marginTop: theme.spacing(0.5),
		overflow: "hidden",
		zIndex: 1000, // Увеличиваем для гарантии поверх других элементов
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	scrollContent: {
		paddingVertical: theme.spacing(1),
	},
	option: {
		paddingVertical: theme.spacing(1.5),
		paddingHorizontal: theme.spacing(2),
	},
	optionPressed: {
		backgroundColor: theme.colors.background.default,
	},
	optionText: {
		color: theme.colors.text.primary,
	},
	selectedOption: {
		backgroundColor: theme.colors.primary.light,
	},
	selectedText: {
		color: theme.colors.text.primary,
		fontWeight: "600",
	},
}));
