import { Tabs } from "expo-router";
import { getTabBarIcon } from "@/ui/TabBarIcon";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsAdmin } from "@/context/AuthContext";
import { View } from "react-native";
import ThemeSwitcher from "@/ui/components/common/ThemeSwitcher";

export default function TabsLayout() {
	const isAdmin = useIsAdmin();
	console.log("isAdmin:", isAdmin);

	return (
		<Tabs
			screenOptions={{
				headerRight: () => (
					<View style={{ marginRight: 10 }}>
						<ThemeSwitcher />
					</View>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: getTabBarIcon(FontAwesome5, "home"),
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
				name="tasks"
				options={{
					title: "Tasks",
					tabBarIcon: getTabBarIcon(FontAwesome5, "tasks"),
					href: isAdmin ? "/tasks" : null,
				}}
			/>
			<Tabs.Screen
				name="admin-panel"
				options={{
					title: "Admin Panel",
					tabBarIcon: getTabBarIcon(FontAwesome5, "shield-alt"),
					href: isAdmin ? "/admin-panel" : null,
				}}
			/>
		</Tabs>
	);
}
