import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AutocompleteContentEditable } from "../src/AutocompleteContentEditable";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Demo/Custom Tags Autocomplete Examples",
	component: AutocompleteContentEditable,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		onChangeInput: { action: "changed" },
		value: { control: "text" },
		placeholder: { control: "text" },
		className: { control: "text" },
		style: { control: "object" },
	},
	// Use `fn` to spy on the onChange arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		value: "",
		// onChange: fn(),
		placeholder: "Type something...",
		className: "custom-class",
		style: { border: "1px solid #ccc", padding: "10px", width: "80vw" },
	},
} satisfies Meta<typeof AutocompleteContentEditable>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = [
	{ label: "#Food", value: "food" },
	{ label: "#Health", value: "health" },
	{ label: "#Lifestyle", value: "lifestyle" },
	{ label: "#Technology", value: "technology" },
	{ label: "#Travel", value: "travel" },
];

export const SearchTagsWithCustomStyledTags: Story = {
	args: {
		placeholder: 'Search for tags, start query with "#"',
		onChangeInput: (value) => {},

		searchTrigger: "#",

		onSearch: (value) => {
			// Simulate search results
			return value && value.length > 0
				? tags.filter((item) =>
						item.label.toLowerCase().includes(value.toLowerCase())
				  )
				: tags;
		},

		renderMenuItem: (item) => (
			<div
				style={{
					backgroundColor: "#e3edf9",
					borderRadius: "16px",
					color: "#4d80c5",
					fontSize: "12px",
					padding: "5px 10px",
				}}
			>
				<span>{item.label}</span>
			</div>
		),

		// style: { width: '300px' },
		showSelectionAsHTMLTag: {
			HTMLTag: "i",
			HTMLInlineStyle: {
				backgroundColor: "lavenderblush",
				border: "1px solid crimson",
				borderRadius: "4px",
				color: "maroon",
				fontSize: "12px",
				padding: "2px 8px",
			},
			HTMLClassName: "custom-tag-class",
		},
		onSelectMenuItem: (item) => console.log("Menu item selected:", item),
		preserveSearchTrigger: false,
	},
};
