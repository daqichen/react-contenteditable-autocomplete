import { Ref, ComponentProps, MouseEvent, ReactNode } from 'react';
export namespace Menu {

    export interface Item {
        label: string;
        value: string;
        icon?: string | ReactNode; // Optional icon for the menu item
        disabled?: boolean; // Optional flag to disable the menu item
        subItems?: Item[]; // Optional sub-items for nested menus
    }

    export type Reference = Ref<HTMLDivElement>; // Type for the reference to the menu element

    export interface Props extends ComponentProps<'div'> {
        items: Item[]; // Array of menu items
        onSelectMenuItem: (item: Item) => void; // Callback when an item is selected
        renderMenuItem?: (item: Item, index: number) => ReactNode; // Optional custom render function for menu items
        position: {
            top: number | null; // Top position of the menu
            left: number | null; // Left position of the menu
        }; // Optional position for absolute positioning of the menu
        searchTerm: string; // Optional search term to filter items
        activeId?: number; // Optional ID of the currently active item
    }

    export interface State {
        isOpen: boolean; // State to track if the menu is open
        selectedItem?: Item; // Currently selected item
        highlightedIndex?: number; // Index of the currently highlighted item
    }
}