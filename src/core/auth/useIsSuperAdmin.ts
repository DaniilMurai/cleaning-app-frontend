import { useCurrentUser } from "@/core/auth";

export default function useIsSuperAdmin() {
	const user = useCurrentUser();
	return user?.role === "superadmin";
}
