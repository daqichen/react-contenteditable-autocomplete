import { ContentEditable } from "./ContentEditable";
import { Menu } from "./Menu";

export namespace AutocompleteContentEditable {
    /**
     * Props for the AutocompleteContentEditable component.
     * Extends ContentEditable.Props (excluding 'onChange') and Menu.Props (excluding 'position', 'items', 'searchTerm').
     */
    export type Props = Omit<ContentEditable.Props, 'onChange'> & Omit<Menu.Props, 'position' | 'items' | 'searchTerm'> & {
        /** Trigger character(s) for search functionality (e.g., '/', '#', '@')
         * @default '/'
        */
        searchTrigger?: string;
        /** Whether to preserve the search trigger in the content 
         * @default false
        */
        preserveSearchTrigger?: boolean;
        /** Callback for search input, returns an array of menu items */
        onSearch?: (value: string) => Menu.Item[];
        /** Delay (in ms) for search input processing
         * @default 300
        */
        searchDelay?: number;
        /** Callback when an item is selected */
        onSelect?: (value: string) => void;
        /**
         * Whether to show the selected item as an HTML tag.
         * If true, the selected item will be wrapped in an anchor tag OR a custom HTML tag (can further be customized with HTMLInlineStyle and HTMLClassName).
         * This allows for more complex styling and interaction, such as opening links in a new tab.
         * If false, the selected item will be displayed as plain text.
         * @default false
         */
        showSelectionAsHTMLTag?: boolean | SelectionHTMLTag<keyof HTMLElementTagNameMap>;
        /** Callback for input change */
        onChangeInput?: (evt: React.FormEvent<HTMLDivElement>) => void;
        /** Class name for the menu */
        menuClassName?: string;
        /** Inline style for the menu */
        menuStyle?: React.CSSProperties;
    };

    /**
     * Configuration for rendering the selected item as a custom HTML tag.
     */
    export interface SelectionHTMLTag<T extends keyof HTMLElementTagNameMap> {
        /** Name of the HTML tag to use (e.g., 'a', 'span') */
        HTMLTag: T;
        /** Inline styles to apply to the tag */
        HTMLInlineStyle?: React.CSSProperties;
        /** Optional class name for the tag */
        HTMLClassName?: string;
    }
}