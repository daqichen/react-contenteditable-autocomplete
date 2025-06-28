import { ContentEditable } from "./ContentEditable";
import { Menu } from "./Menu";

export namespace AutocompleteContentEditable {
    export type Props = Omit<ContentEditable.Props, 'onChange'> & Omit<Menu.Props, 'position' | 'items' | 'searchTerm'> & {
        searchTrigger?: string; // Trigger for search functionality
        preserveSearchTrigger?: boolean; // Whether to preserve the search trigger in the content
        onSearch?: (value: string) => Menu.Item[]; // Callback for search input
        searchDelay?: number; // Delay for search input processing
        onSelect?: (value: string) => void; // Callback for item selection
        onChangeInput?: (evt: React.FormEvent<HTMLDivElement>) => void; // Callback for input change
    };
}
