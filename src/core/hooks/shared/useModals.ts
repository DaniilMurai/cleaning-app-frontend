import { useState } from "react";

type ModalName = string;

interface ModalsState {
	[key: string]: boolean;
}

/**
 * Custom hook for managing modal states
 * @param initialModals - Object with initial modal states
 * @returns Object with modal states and functions to open and close modals
 */
export default function useModals<T extends ModalsState>(initialModals: T) {
	const [modals, setModals] = useState<T>(initialModals);

	const openModal = (modalName: keyof T) => {
		setModals(prev => ({ ...prev, [modalName]: true }));
	};

	const closeModal = (modalName: keyof T) => {
		setModals(prev => ({ ...prev, [modalName]: false }));
	};

	return { modals, openModal, closeModal };
}
