import { ContentEditable } from "./ContentEditable";
import { Menu } from "./Menu";

export namespace AutocompleteContentEditable {
    export type Props = Omit<ContentEditable.Props, 'onChange'> & Omit<Menu.Props, 'position' | 'items'> & {
        searchTrigger?: string; // Trigger for search functionality
        onSearch?: (value: string) => Menu.Item[]; // Callback for search input
        onSelect?: (value: string) => void; // Callback for item selection
        onChangeInput?: (evt: React.FormEvent<HTMLDivElement>) => void; // Callback for input change
    };
}
