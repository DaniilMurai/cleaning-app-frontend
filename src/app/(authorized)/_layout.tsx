import { Stack } from "expo-router";
import useAuth, { useUserStatus } from "@/context/AuthContext";
import { ActivityIndicator } from "react-native";

export default function AuthorizedLayout() {
	// const { token } = useAuth();
	//TODO Вернуть обратно!!!

	// if (!token) {
	// 	return <Redirect href={"/Login"} />;
	// }

	const { user, loading } = useAuth();
	const userStatus = useUserStatus();

	if (loading) return <ActivityIndicator />;

	// if (!user) return <Redirect href={"/Login"} />; //TODO вернуть и протестить
	// if (userStatus !== "active") {
	// 	router.replace("/Activate");
	// 	return null;
	// }

	// const isAdmin = useIsAdmin(); //TODO вернуть

	const isAdmin = false; //TODO убрать

	return (
		<Stack>
			<Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />

			{/*/!* Открытые экраны *!/*/}
			{/*<Stack.Screen name="(tabs)/index" />*/}
			{/*<Stack.Screen name="(tabs)/profile" />*/}

			{/*/!* Защищённые экраны: будут недоступны, если isAdmin=false *!/*/}
			{/*<Stack.Protected guard={isAdmin}>*/}
			{/*	<Stack.Screen name="(tabs)/tasks" />*/}
			{/*	<Stack.Screen name="(tabs)/admin_panel" />*/}
			{/*</Stack.Protected>*/}
		</Stack>

		// TODO Вернуть когда бэк заработает и можно тестить разделение на админа и юзероа

		// <Stack>
		// 	<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		// </Stack> //TODO вернуть
	);
}
