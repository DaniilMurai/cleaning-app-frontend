import { useCurrentUser } from "@/core/auth";
import { includes } from "@/core/helpers/array";

export default function useIsAdmin() {
	const user = useCurrentUser();
	return includes(user?.role, "admin", "superadmin");
}
