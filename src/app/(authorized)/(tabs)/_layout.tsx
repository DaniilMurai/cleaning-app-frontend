import { Tabs } from "expo-router";
import { getTabBarIcon } from "@/ui";
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";
import LanguageSwitcher from "@/components/settings/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useIsAdmin } from "@/core/auth";

export default function TabsLayout() {
	const isAdmin = useIsAdmin();

	const { t } = useTranslation();
	return (
		<Tabs
			screenOptions={{
				headerRight: () => (
					<View style={{ flexDirection: "row", marginRight: 10 }}>
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
