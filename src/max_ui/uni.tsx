import { withUnistyles } from "react-native-unistyles";
import OutsidePressHandler from "react-native-outside-press";
import {
	AntDesign,
	FontAwesome6,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, TextInput } from "react-native";
import ContentLoader from "react-content-loader/native";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import { Checkbox } from "expo-checkbox";

export const UniOutsidePressHandler = withUnistyles(OutsidePressHandler);
export const UniMaterialCommunityIcons = withUnistyles(MaterialCommunityIcons, theme => ({
	color: theme.colors.text.primary,
}));
export const UniMaterialIcons = withUnistyles(MaterialIcons, theme => ({
	color: theme.colors.text.primary,
}));
export const UniIonicons = withUnistyles(Ionicons, theme => ({
	color: theme.colors.text.primary,
}));
export const UniFontAwesome6 = withUnistyles(FontAwesome6 as Icon<string, "fontawesome6">);
export const UniImage = withUnistyles(Image);
export const UniActivityIndicator = withUnistyles(ActivityIndicator);
export const UniPressable = withUnistyles(Pressable);
export const UniText = withUnistyles(Text);
export const UniTextInput = withUnistyles(TextInput);
export const UniContentLoader = withUnistyles(ContentLoader, theme => ({
	backgroundColor: theme.colors.skeleton.background,
	foregroundColor: theme.colors.skeleton.foreground,
}));
export const UniCheckbox = withUnistyles(Checkbox);
export const UniAntDesign = withUnistyles(AntDesign);
