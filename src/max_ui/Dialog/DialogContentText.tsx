import Typography, { TypographyProps } from "@/max_ui/Typography.tsx";
import PlatformExt from "@/features/PlatformExt.ts";

export default function DialogContentText({ children, ...props }: TypographyProps) {
	return (
		<Typography {...props} textAlign={PlatformExt.select({ apple: "center", default: "left" })}>
			{children}
		</Typography>
	);
}
