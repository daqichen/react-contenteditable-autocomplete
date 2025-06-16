import { FormEvent, Ref, CSSProperties } from "react";
import { Menu } from "./Menu";

export namespace ContentEditable {
  export type Reference = Ref<HTMLDivElement>;

  export interface Props {
    value: string;
    onChange: (evt: FormEvent<HTMLDivElement>) => void;
    searchTrigger: string;
    onSearch?: (value: string) => Menu.Item[];
    onSelect?: (value: string) => void;
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
  }

  export interface State {
    isFocused: boolean;
  }
}