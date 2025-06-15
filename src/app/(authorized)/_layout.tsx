import { Redirect, Stack } from "expo-router";
import Loading from "@/ui/common/Loading";
import { useAuth } from "@/core/auth";

export default function AuthorizedLayout() {
	const { isLoaded, isAuthorised } = useAuth();

	if (!isLoaded) {
		return <Loading />;
	}

	if (!isAuthorised) {
		console.log("Unauthorised, redirecting to login");
		return <Redirect href={"/Login"} />;
	}

	return (
		<Stack>
			<Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
		</Stack>
	);
}
