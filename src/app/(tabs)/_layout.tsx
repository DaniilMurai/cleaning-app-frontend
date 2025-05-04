import { Tabs } from "expo-router";
import { getTabBarIcon } from "@/ui/TabBarIcon";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: getTabBarIcon(FontAwesome5, "home"),
				}}
			/>
			<Tabs.Screen
				name="tasks"
				options={{
					title: "Tasks",
					tabBarIcon: getTabBarIcon(FontAwesome5, "tasks"),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: getTabBarIcon(FontAwesome5, "user-alt"),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: getTabBarIcon(FontAwesome, "gear"),
				}}
			/>
		</Tabs>
	);
}
