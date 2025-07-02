import { Ref, ComponentProps, MouseEvent, ReactNode } from 'react';

export namespace Menu {
    /**
     * Represents a single menu item.
     */
    export interface Item {
        /** Display label for the menu item */
        label: string;
        /** Value associated with the menu item */
        value: string;
        /** Optional icon or ReactNode to display with the item */
        icon?: string | ReactNode;
        /** Optional flag to disable the menu item */
        disabled?: boolean;
        /** Optional sub-items for nested menus */
        subItems?: Item[];
    }

    /**
     * Reference type for the menu element.
     */
    export type Reference = Ref<HTMLDivElement>;

    /**
     * Props for the Menu component.
     */
    export interface Props extends ComponentProps<'div'> {
        /** Array of menu items */
        items: Item[];
        /** Callback when an item is selected */
        onSelectMenuItem: (item: Item) => void;
        /** Optional custom render function for menu items */
        renderMenuItem?: (item: Item, index: number) => ReactNode;
        /** Position for absolute positioning of the menu */
        position: {
            /** Top position of the menu */
            top: number | null;
            /** Left position of the menu */
            left: number | null;
        };
        /** Search term to filter items */
        searchTerm: string;
        /** Optional ID of the currently active item */
        activeId?: number;
    }

    /**
     * State for the Menu component.
     */
    export interface State {
        /** State to track if the menu is open */
        isOpen: boolean;
        /** Currently selected item */
        selectedItem?: Item;
        /** Index of the currently highlighted item */
        highlightedIndex?: number;
    }
}