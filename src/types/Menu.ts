import { Ref, ComponentProps, ReactNode } from "react";

export namespace Menu {
	/**
	 * Represents a single menu item.
	 */
	export interface Item {
		/** Optional flag to disable the menu item */
		disabled?: boolean;

		/** Optional icon (URL string or ReactNode) to display with the item */
		icon?: string | ReactNode;

		/** Display label for the menu item */
		label: string;

		/** Optional sub-items for nested menus */
		subItems?: Item[];

		/** Value associated with the menu item */
		value: string;
	}

	export type Reference = Ref<HTMLDivElement>;

	export type Position = { top: number | null; left: number | null };

	/**
	 * Props for the Menu component.
	 */
	export interface Props extends ComponentProps<"div"> {
		/** Optional ID of the currently active (highlighted) menu item. */
		activeId?: number;

		/** Array of menu items to display. */
		items: Item[];

		/** Callback function invoked when a menu item is selected. */
		onSelectMenuItem: (item: Item) => void;

		/** Object specifying the top and left position for absolute positioning of the menu. */
		position: Position;

		/** Optional custom render function for menu items. */
		renderMenuItem?: (item: Item, index: number) => ReactNode;

		/** Class name for the root element of the menu, used for portal rendering. */
		rootClassName: string;

		/** Current search term used to filter menu items. */
		searchTerm: string;
	}

	/**
	 * State for the Menu component.
	 */
	export interface State {
		/** Index of the currently highlighted menu item */
		highlightedIndex?: number;

		/** Boolean indicating if the menu is open */
		isOpen: boolean;

		/** Currently selected menu item */
		selectedItem?: Item;
	}
}
