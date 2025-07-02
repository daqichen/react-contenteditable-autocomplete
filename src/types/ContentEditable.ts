import { FormEvent, Ref, CSSProperties, ComponentProps } from "react";

export namespace ContentEditable {
  /**
   * Reference type for the content editable div.
   */
  export type Reference = Ref<HTMLDivElement>;

  /**
   * Props for the ContentEditable component.
   */
  export interface Props extends Omit<ComponentProps<'div'>, 'onChange'> {
    /** The current value of the content editable div */
    value: string;
    /** Callback fired when the content changes */
    onChange: (evt: FormEvent<HTMLDivElement>) => void;
    /** Placeholder text to display when empty
     * @default 'Type here...'
     */
    placeholder?: string;
    /** Optional class name for the content editable div */
    className?: string;
    /** Optional inline styles for the content editable div */
    style?: CSSProperties;
  }

  /**
   * State for the ContentEditable component.
   */
  export interface State {
    /** Whether the content editable div is focused */
    isFocused: boolean;
  }
}