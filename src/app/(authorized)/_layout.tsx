import { Redirect, Stack } from "expo-router";
import useAuth from "@/core/context/AuthContext";
import Loading from "@/ui/common/Loading";

export default function AuthorizedLayout() {
	const { token, loading, user } = useAuth();

	if (loading) {
		console.log("Loading...");
		return <Loading />;
	}

	if (!token) {
		console.log("No token: " + token);
		return <Redirect href={"/Login"} />;
	} else {
		console.log("Token in authorized layout: " + token);
	}

	if (!user) {
		console.log("No user: " + user);
		// logout();
	} else {
		console.log("User in authorized layout: " + user.nickname);
	}

	return (
		<Stack>
			<Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
		</Stack>
	);
}
