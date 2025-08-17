import React, { ReactNode, useRef, useState } from "react";
import { View, ViewProps } from "react-native";
import Popper from "@/max_ui/Popper";
import { Button } from "@/ui";
import { ButtonColor, ButtonSize, ButtonVariant } from "@/ui/common/Button.tsx";
import { useTranslation } from "react-i18next";

interface BasePopoverProps extends ViewProps {
	buttonTriggerVariant: ButtonVariant;
	buttonTriggerText?: string;
	buttonTriggerColor?: ButtonColor;
	buttonTriggerSize?: ButtonSize;
	children: ReactNode;
}

export default function BasePopover({
	buttonTriggerVariant = "text",
	buttonTriggerText,
	buttonTriggerColor,
	buttonTriggerSize,
	children,
}: BasePopoverProps) {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { t } = useTranslation();
	const buttonRef = useRef<View>(null);

	return (
		<>
			<Button
				style={{ flexShrink: 1, flexGrow: 0 }}
				ref={buttonRef}
				variant={buttonTriggerVariant}
				color={buttonTriggerColor}
				size={buttonTriggerSize}
				onPress={() => setIsVisible(p => !p)}
			>
				{buttonTriggerText ?? t("reports.view_exports")}
			</Button>
			<Popper
				anchorEl={buttonRef.current}
				setVisible={setIsVisible}
				visible={isVisible}
				contentPosition={["bottom", "left"]}
				anchorPosition={["bottom", "right"]}
				spacing={"dense"}
			>
				{children}
			</Popper>
		</>
	);
}
