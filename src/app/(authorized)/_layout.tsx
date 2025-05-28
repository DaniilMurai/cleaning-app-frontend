import { Redirect, Stack } from "expo-router";
import useAuth from "@/context/AuthContext";
import Loading from "@/ui/Loading";

export default function AuthorizedLayout() {
	const { token, loading } = useAuth();

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

	return (
		<Stack>
			<Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
		</Stack>
	);
}
