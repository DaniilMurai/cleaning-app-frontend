import { Fragment, ReactNode, useCallback, useMemo, useState } from "react";
import PortalContext from "./PortalContext";
import { PortalProps } from "./types";

export default function PortalProvider({ children, context = PortalContext }: PortalProps) {
	const [elements, setElements] = useState<Record<string, ReactNode>>({});

	const putElement = useCallback((id: string, element: ReactNode) => {
		setElements(prev => {
			const result = { ...prev };
			result[id] = element;
			return result;
		});
	}, []);

	const removeElement = useCallback((id: string) => {
		setElements(prev => {
			if (!(id in prev)) {
				return prev;
			}
			const res = { ...prev };
			delete res[id];
			return res;
		});
	}, []);

	const value = useMemo(() => ({ putElement, removeElement }), [putElement, removeElement]);

	return (
		<context.Provider value={value}>
			{children}
			<>
				{Object.entries(elements).map(([id, element]) => (
					<Fragment key={id}>{element}</Fragment>
				))}
			</>
		</context.Provider>
	);
}
