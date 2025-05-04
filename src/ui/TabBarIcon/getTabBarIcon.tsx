import { Component } from "react";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import TabBarIcon, { NativeTabBarIconProps } from "./TabBarIcon";

export const getTabBarIcon =
	<GLYPHS extends string>(IconComponent: typeof Component<IconProps<GLYPHS>>, name: GLYPHS) =>
	(props: NativeTabBarIconProps) => (
		<TabBarIcon {...props} IconComponent={IconComponent} name={name} />
	);
