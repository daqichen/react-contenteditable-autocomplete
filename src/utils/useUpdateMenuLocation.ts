import { useState } from "react";
import { throttle } from "./inputHelper";

interface Props {
	menuRef: React.RefObject<HTMLDivElement | null>;
	setActiveMenuItemId: React.Dispatch<React.SetStateAction<number>>;
}

export const useUpdateMenuLocation = ({
	setActiveMenuItemId,
	menuRef,
}: Props) => {
	const [menuPosition, setMenuPosition] = useState<{
		top: number | null;
		left: number | null;
	}>({ top: null, left: null });

	const removeMenu = throttle(() => {
		if (menuRef.current) {
			setMenuPosition({ top: null, left: null });
			setActiveMenuItemId(0);
		}
	}, 100);

	return {
		menuPosition,
		removeMenu,
		setMenuPosition,
	};
};
