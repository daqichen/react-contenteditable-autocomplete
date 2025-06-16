import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AutocompleteContentEditable } from '../src/AutocompleteContentEditable';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Demo/Autocomplete ContentEditable',
  component: AutocompleteContentEditable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onChangeInput: { action: 'changed' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    className: { control: 'text' },
    style: { control: 'object' },
  },
  // Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    value: '',
    // onChange: fn(),
    placeholder: 'Type something...',
    className: 'custom-class',
    style: { border: '1px solid #ccc', padding: '10px', width: '300px' },
  },
} satisfies Meta<typeof AutocompleteContentEditable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: '',
    onChangeInput: (value) => {}, //console.log('Changed value:', value),
    searchTrigger: '/',
    onSearch: (value) => {
      console.log('Search triggered with:', value)
      // Simulate search results
      return [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Cherry', value: 'cherry' },
      ].filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
    },
    onSelect: (value) => {}, //console.log('Selected value:', value),
    placeholder: 'Type something...',
    style: { width: '300px' },
    onSelectMenuItem: (item) => console.log('Menu item selected:', item),
  },
};
