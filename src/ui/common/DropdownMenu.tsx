// Обновленный код DropdownMenu.tsx

import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Typography from "@/ui/common/Typography";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export interface DropdownMenuItem {
	icon?: string;
	label: string;
	onPress: () => void;
	disabled?: boolean;
	// Условное отображение опции меню
	condition?: boolean;
}

interface DropdownMenuProps {
	items: DropdownMenuItem[];
	placement?: "top" | "bottom" | "left" | "right";
	iconSize?: number;
}

export default function DropdownMenu({
	items,
	placement = "left",
	iconSize = 20,
}: DropdownMenuProps) {
	const [visible, setVisible] = useState(false);
	const buttonRef = useRef<View>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	const opacity = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	// In showMenu function, modify the positioning logic:
	const showMenu = () => {
		buttonRef.current?.measureInWindow((x, y, width, height) => {
			let top = y;
			let left = x;
			const menuWidth = 150; // 150px переведено в theme.spacing
			const screenWidth = Dimensions.get("window").width;

			// Для слева от кнопки - центрируем вертикально и смещаем влево
			top = y - 8; // Небольшой отступ вверх
			left = Math.max(4, x - menuWidth - 20); // Размещаем слева с отступом

			// Если не помещается слева, пробуем справа
			if (left <= 0) {
				left = x + width + 4; // Размещаем справа
			}

			// Если все равно выходит за пределы экрана, показываем под кнопкой
			if (left + menuWidth > screenWidth) {
				left = screenWidth - menuWidth - 8;
				top = y + height + 4;
			}
			
			// Применяем настройки placement только если они явно указаны
			if (placement !== "left") {
				switch (placement) {
					case "bottom":
						top = y + height + 4;
						left = x;
						break;
					case "top":
						top = y - 150; // 150px
						left = x;
						break;
					case "right":
						left = x + width + 4;
						top = y;
						break;
				}
			}

			// Финальная проверка на выход за границы экрана
			if (left + menuWidth > screenWidth) {
				left = screenWidth - menuWidth - 8;
			}
			if (left < 0) {
				left = 4;
			}

			setPosition({ top, left });
			setVisible(true);
		});
	};

	useEffect(() => {
		if (visible) {
			opacity.value = withTiming(1, { duration: 50, easing: Easing.ease });
		} else {
			opacity.value = 0;
		}
	}, [visible]);

	const hideMenu = () => {
		setVisible(false);
	};

	const handleItemPress = (onPress: () => void) => {
		hideMenu();
		onPress();
	};

	// Фильтруем элементы по условию видимости
	const visibleItems = items.filter(item => item.condition === undefined || item.condition);

	// Если нет видимых элементов, не показываем меню
	if (visibleItems.length === 0) {
		return null;
	}

	return (
		<>
			<Pressable ref={buttonRef} onPress={showMenu} style={styles.menuButton}>
				<FontAwesome5 name="ellipsis-v" size={iconSize} color={styles.icon.color} />
			</Pressable>

			<Modal visible={visible} transparent animationType="none" onRequestClose={hideMenu}>
				<Pressable style={styles.overlay} onPress={hideMenu}>
					<Animated.View
						style={[
							styles.menuContainer,
							{ top: position.top, left: position.left },
							animatedStyle,
						]}
					>
						{visibleItems.map((item, index) => (
							<Pressable
								key={index}
								style={[styles.menuItem, item.disabled && styles.disabledItem]}
								onPress={() => !item.disabled && handleItemPress(item.onPress)}
								disabled={item.disabled}
							>
								{item.icon && (
									<View style={styles.iconContainer}>
										<FontAwesome5
											name={item.icon}
											size={16}
											style={styles.icon}
											color={
												item.disabled
													? styles.disabledText.color
													: styles.icon.color
											}
										/>
									</View>
								)}
								<Typography
									variant="body2"
									style={[item.disabled && styles.disabledText]}
								>
									{item.label}
								</Typography>
							</Pressable>
						))}
					</Animated.View>
				</Pressable>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create(theme => ({
	menuButton: {
		padding: theme.spacing(1),
		borderRadius: theme.borderRadius(1),
		color: theme.colors.text.primary, // Добавляем цвет для иконки в соответствии с темой
	},
	overlay: {
		flex: 1,
	},
	menuContainer: {
		position: "absolute",
		width: 250, // Фиксированная ширина меню
		// height: 250,
		backgroundColor: theme.colors.background.paper,
		borderRadius: theme.borderRadius(1),
		// shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		// shadowRadius: 3.84,
		elevation: 5,
		padding: theme.spacing(1),
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		width: 250,
		padding: theme.spacing(2),
		backgroundColor: theme.colors.background.paper,
	},
	iconContainer: {
		width: 24,
		marginRight: theme.spacing(1),
		alignItems: "center",
	},
	icon: {
		color: theme.colors.text.primary, // Цвет иконки в соответствии с темой
	},
	disabledItem: {
		opacity: 0.5,
	},
	disabledText: {
		color: theme.colors.text.secondary,
	},
}));
