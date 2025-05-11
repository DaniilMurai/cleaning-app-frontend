import { Redirect, Stack } from "expo-router";
import useAuth from "@/context/AuthContext";
import Loading from "@/ui/Loading";

export default function AuthorizedLayout() {
	const { token, loading } = useAuth();

	if (!token) {
		return <Redirect href={"/Login"} />;
	}

	if (loading) return <Loading />;

	return (
		<Stack>
			<Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
		</Stack>
	);
}
