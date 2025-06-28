import { FormEvent, Ref, CSSProperties, ComponentProps } from "react";

export namespace ContentEditable {
  export type Reference = Ref<HTMLDivElement>;

  export interface Props extends Omit<ComponentProps<'div'>, 'onChange'> {
    value: string;
    onChange: (evt: FormEvent<HTMLDivElement>) => void;
    // searchTrigger: string;
    // onSearch?: (value: string) => Menu.Item[];
    // onSelect?: (item: Menu.Item) => void;
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
  }

  export interface State {
    isFocused: boolean;
  }
}