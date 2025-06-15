import { TokenPair } from "@/api/auth";

const OnAuthChangeCallbacks: {
	onTokenRefreshed: (data: TokenPair) => unknown;
	onTokenRefreshFailed: () => unknown;
} = {
	onTokenRefreshed: () => {},
	onTokenRefreshFailed: () => {},
};

export default OnAuthChangeCallbacks;
