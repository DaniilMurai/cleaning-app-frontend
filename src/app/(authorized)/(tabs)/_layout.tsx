import { Tabs } from "expo-router";
import { getTabBarIcon } from "@/ui/TabBarIcon";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsAdmin } from "@/context/AuthContext";
import { View } from "react-native";
import LanguageSwitcher from "@/ui/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
	const isAdmin = useIsAdmin();
	console.log("isAdmin:", isAdmin);

	const { t } = useTranslation();
	return (
		<Tabs
			screenOptions={{
				headerRight: () => (
					<View style={{ flexDirection: "row", marginRight: 10 }}>
						{/*<ThemeSwitcher />*/}
						<LanguageSwitcher />
					</View>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: t("tabs.home"),
					tabBarIcon: getTabBarIcon(FontAwesome5, "home"),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: t("tabs.profile"),
					tabBarIcon: getTabBarIcon(FontAwesome5, "user-alt"),
				}}
			/>
			<Tabs.Screen
				name="admin"
				options={{
					title: t("tabs.admin"),
					tabBarIcon: getTabBarIcon(FontAwesome5, "tasks"),
					href: isAdmin ? "/admin" : null,
				}}
			/>
			<Tabs.Screen
				name="users"
				options={{
					title: t("tabs.users"),
					tabBarIcon: getTabBarIcon(FontAwesome5, "shield-alt"),
					href: isAdmin ? "/users" : null,
				}}
			/>
		</Tabs>
	);
}
