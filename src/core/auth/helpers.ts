import { TokenPair } from "@/api/auth";
import { AccessTokenStorage, RefreshTokenStorage } from "@/core/auth/storage";

export async function updateTokens(data: TokenPair) {
	const { access_token, refresh_token, token_type } = data;

	const accessTokenStr = `${token_type} ${access_token}`;
	await RefreshTokenStorage.set(refresh_token);
	await AccessTokenStorage.set(accessTokenStr);
	return {
		accessToken: accessTokenStr,
		refreshToken: refresh_token,
	};
}

export async function removeTokens() {
	await RefreshTokenStorage.remove();
	await AccessTokenStorage.remove();
}
