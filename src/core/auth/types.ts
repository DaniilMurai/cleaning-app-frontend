import { TokenPair } from "@/api/auth";

export interface AuthContextType {
	isLoaded: boolean;
	isAuthorised: boolean;
	onLogin: (data: TokenPair) => Promise<boolean>;
	onLogout: () => Promise<void>;
	validateToken: () => Promise<boolean>;
}
