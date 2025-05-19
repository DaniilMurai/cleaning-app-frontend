import { Context, PropsWithChildren, ReactNode } from "react";

export interface PortalContextType {
	putElement: (id: string, element: ReactNode) => void;
	removeElement: (id: string) => void;
}

export type PortalProps = PropsWithChildren<{
	context?: Context<PortalContextType>;
}>;
