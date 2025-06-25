import Storage from "@/features/Storage";
import { AFTER_FIRST_UNLOCK } from "expo-secure-store";

export const AccessTokenStorage = Storage("accessToken", true, {
	keychainAccessible: AFTER_FIRST_UNLOCK,
});

export const RefreshTokenStorage = Storage("refreshToken", true, {
	keychainAccessible: AFTER_FIRST_UNLOCK,
});

export const ReportIdStorage = Storage("ReportId");

export const AssignmentStorage = Storage("Assignment");
