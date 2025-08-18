import { Platform } from "react-native";

function getWebOS() {
	if (Platform.OS !== "web") return Platform.OS;

	// noinspection JSDeprecatedSymbols
	const userAgent = navigator.userAgent || navigator.vendor || "";

	// Windows
	if (/windows/i.test(userAgent)) {
		return "windows";
	}

	// Android
	if (/android/i.test(userAgent)) {
		return "android";
	}

	// iOS
	// @ts-expect-error. Unknown MSStream
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "ios";
	}

	// macOS
	if (/Macintosh/.test(userAgent)) {
		return "macos";
	}

	return "other";
}

const isApple = ["ios", "macos"].includes(getWebOS());

export type PlatformExtOSType = ReturnType<typeof getWebOS>;

interface PlatformExtType {
	OS: PlatformExtOSType;
	isApple: boolean;
	select<T>(
		specifics:
			| ({ [platform in PlatformExtOSType | "apple"]?: T } & { default: T })
			| ({ [platform in Exclude<PlatformExtOSType, "ios" | "macos"> | "apple"]: T } & {
					ios?: T;
					macos?: T;
			  })
			| { [platform in PlatformExtOSType]: T }
	): T;
	select<T>(specifics: { [platform in PlatformExtOSType | "apple"]?: T }): T | undefined;
}

const PlatformExt: PlatformExtType = {
	OS: getWebOS(),
	isApple: isApple,
	select: params => {
		const os = getWebOS();
		if (os in params) {
			return params[os];
		}

		if (isApple && "apple" in params) {
			return params["apple"];
		}

		if ("default" in params) {
			return params["default"];
		}
		return undefined;
	},
};

export default PlatformExt;
