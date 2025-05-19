import { PortalProps } from "./types";
import { useContext, useEffect, useId } from "react";
import PortalContext from "./PortalContext";

export default function Portal({
	children,
	context = PortalContext,
	id: _providedId,
}: PortalProps & {
	id?: string;
}) {
	const internalId = useId();

	const id = _providedId || internalId;

	const { putElement, removeElement } = useContext(context);

	useEffect(() => {
		putElement(id, children);
	}, [children, id, putElement]);

	useEffect(() => {
		return () => {
			removeElement(id);
		};
	}, [id, removeElement]);

	return null;
}
