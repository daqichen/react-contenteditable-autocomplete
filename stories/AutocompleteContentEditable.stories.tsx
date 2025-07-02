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
    style: { border: '1px solid #ccc', padding: '10px', width: '80vw' },
  },
} satisfies Meta<typeof AutocompleteContentEditable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BoldSearchTerm: Story = {
  args: {
    placeholder: 'Search for books, start query with "/"',
    onChangeInput: (value) => {},

    searchTrigger: '/',

    onSearch: (value) => {
      // Simulate search results
      return [
        { label: 'Of Mice and Men', value: 'of-mice-and-men'},
        { label: 'The Great Gatsby', value: 'the-great-gatsby' },
        { label: 'To Kill a Mockingbird', value: 'to-kill-a-mockingbird' },
        { label: '1984', value: '1984' },
        { label: 'Pride and Prejudice', value: 'pride-and-prejudice' },
        { label: 'The Catcher in the Rye', value: 'the-catcher-in-the-rye' },
        { label: 'Brave New World', value: 'brave-new-world' },
      ].filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
    },
    
    onSelectMenuItem: (item) => console.log('Menu item selected:', item),
    preserveSearchTrigger: false
  },
};


export const SearchFruitsWithIcons: Story = {
  args: {
    placeholder: 'Search for fruits, start query with "/"',
    onChangeInput: (value) => {},

    searchTrigger: '/',

    onSearch: (value) => {
      // Simulate search results
      // Unicode icons for fruits: https://apps.timwhitlock.info/emoji/tables/unicode
      return [
        { label: 'Apple', value: 'apple', icon: <span>&#x1F34E;</span> },
        { label: 'Banana', value: 'banana', icon: <span>&#x1F34C;</span> },
        { label: 'Cherry', value: 'cherry', icon: <span>&#x1F352;</span> },
        { label: 'Peach', value: 'peach', icon: <span>&#x1F351;</span> },
        { label: 'Pineapple', value: 'pineapple', icon: <span>&#x1F34D;</span> },
        { label: 'Grape', value: 'grape', icon: <span>&#x1F347;</span> },
        { label: 'Honeydew', value: 'honeydew', icon: <i>&#x1F348;</i> },
      ].filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
    },
    
    onSelectMenuItem: (item) => console.log('Menu item selected:', item),
    preserveSearchTrigger: false
  },
};

const tags = [
  { label: '#Lifestyle', value: 'lifestyle' },
  { label: '#Technology', value: 'technology' },
  { label: '#Health', value: 'health' },
  { label: '#Travel', value: 'travel' },
  { label: '#Food', value: 'food' },
]

export const SearchTagsWithCustomStyledTags: Story = {
  args: {
    placeholder: "Search for tags, start query with \"#\"",
    onChangeInput: (value) => {},

    searchTrigger: "#",

    onSearch: (value) => {
      // Simulate search results
      return value && value.length > 0 ? tags.filter(item => item.label.toLowerCase().includes(value.toLowerCase())) : tags;
    },

    renderMenuItem: (item) => (
      <div style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#e3edf9', borderRadius: '16px', color: '#4d80c5'}}>
        <span>{item.label}</span>
      </div>
    ),
    
    // style: { width: '300px' },
    showSelectionAsHTMLTag: ({
      HTMLTag: 'i', 
      HTMLInlineStyle: {
        backgroundColor: 'lavenderblush',
        borderRadius: '4px',
        border: '1px solid crimson',
        padding: '2px 8px',
        fontSize: '12px',
        color: 'maroon',
      },
      HTMLClassName: 'custom-tag-class',
    }),
    onSelectMenuItem: (item) => console.log('Menu item selected:', item),
    preserveSearchTrigger: false
  },
};
