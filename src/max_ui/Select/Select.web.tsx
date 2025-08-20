import "./select-web.scss";
import * as RadixSelect from "@radix-ui/react-select";
import { SelectProps } from "@/max_ui/Select/types";
import { useUnistyles } from "react-native-unistyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { isInteger } from "@/core/helpers/numbers.ts";
import { useEffect, useRef, useState } from "react";

// Empty value string doesn't work
export default function Select<TValue extends string | number | undefined>({
	value,
	onChange,
	data,
	selectWebWrapperProps,
	selectWebProps,
	selectWebIconWrapperProps,
	size,
}: SelectProps<TValue>) {
	const { theme } = useUnistyles();
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const [triggerWidth, setTriggerWidth] = useState<number | null>(null);

	const [triggerOpen, setTriggerOpen] = useState<boolean>(false);

	useEffect(() => {
		if (triggerRef.current) {
			setTriggerWidth(triggerRef.current.offsetWidth);
		}
	}, []);

	const sizeStyles = {
		small: { paddingY: theme.spacing(0.5), paddingX: theme.spacing(1), fontSize: 14 },
		medium: { paddingY: theme.spacing(1), paddingX: theme.spacing(1.25), fontSize: 16 },
		large: { paddingY: theme.spacing(1.5), paddingX: theme.spacing(1.5), fontSize: 18 },
	};
	const currentSize = sizeStyles[size || "medium"];

	return (
		<RadixSelect.Root
			value={value ? String(value) : ""}
			onValueChange={val => {
				onChange && onChange((isInteger(val) ? parseInt(val) : val) as TValue);
			}}
			onOpenChange={setTriggerOpen}
		>
			<RadixSelect.Trigger
				ref={triggerRef}
				{...selectWebWrapperProps}
				className="select-wrapper"
				style={{
					position: "relative",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					paddingLeft: currentSize.paddingX,
					paddingRight: currentSize.paddingX + 6,
					paddingTop: currentSize.paddingY,
					paddingBottom: currentSize.paddingY,
					width: "100%",
					fontSize: currentSize.fontSize,
					borderRadius: theme.borderRadius(3),
					backgroundColor: theme.colors.components.input.background,
					borderWidth: 1,
					gap: theme.spacing(1),
					borderStyle: "solid",
					color: theme.colors.text.primary,
					outline: "none",
					cursor: "pointer",
					...selectWebWrapperProps?.style,
					...(triggerOpen
						? { borderColor: theme.colors.primary.main }
						: { borderColor: theme.colors.components.input.border }),
				}}
			>
				<RadixSelect.Value placeholder="Выберите значение" />
				<RadixSelect.Icon>
					<Ionicons name="chevron-down" size={10} color={theme.colors.text.primary} />
				</RadixSelect.Icon>
			</RadixSelect.Trigger>

			<RadixSelect.Portal>
				<RadixSelect.Content
					position="popper"
					sideOffset={4}
					className="select-content"
					style={{
						minWidth: triggerWidth ?? "auto",
						backgroundColor: theme.colors.components.input.background,
						borderRadius: theme.borderRadius(3),
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
						overflow: "hidden",
						animation: "fadeIn 150ms ease",
						zIndex: 9999, // <-- добавляем это
					}}
				>
					<RadixSelect.Viewport style={{ padding: 4 }}>
						{data.map(el => (
							<RadixSelect.Item
								key={el.value || el.label}
								value={String(el.value || "")}
								style={{
									padding: "6px 12px",
									borderRadius: 6,
									cursor: "pointer",
									fontSize: currentSize.fontSize,
									color: theme.colors.text.primary,
								}}
							>
								<RadixSelect.ItemText>{el.label}</RadixSelect.ItemText>
							</RadixSelect.Item>
						))}
					</RadixSelect.Viewport>
				</RadixSelect.Content>
			</RadixSelect.Portal>
		</RadixSelect.Root>
	);
}
