import { Component } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

export interface NativeTabBarIconProps {
	focused: boolean;
	color: string;
	size: number;
}

interface TabBarIconProps<GLYPHS extends string> extends NativeTabBarIconProps {
	name: GLYPHS;
	IconComponent: typeof Component<IconProps<GLYPHS>>;
}

export default function TabBarIcon<GLYPHS extends string>({
	color,
	name,
	IconComponent,
	size,
}: TabBarIconProps<GLYPHS>) {
	return <IconComponent name={name} size={size} color={color} />;
}
