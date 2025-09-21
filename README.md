<p align="center">
  <img width="200px" height="200px" alt="react-custom-autocomplete" src="https://main--6865b05aa79b3c94910be512.chromatic.com/logo.png"/>
</p>
<h1 align="center"><code>React Custom Autocomplete</code></h1>

<p align="center">
  React component for customizing user input autocomplete - using <code>contenteditable</code> div
</p>

<p align="center">
  <a href="https://npm.im/react-custom-autocomplete"><img src="https://img.shields.io/npm/v/react-custom-autocomplete?style=flat-square" alt="NPM Version" /></a>
  <a href="https://npm.im/react-custom-autocomplete"><img src="https://img.shields.io/npm/l/react-custom-autocomplete?style=flat-square" alt="MIT License" /></a>
  <a href="https://github.com/daqichen/react-contenteditable-autocomplete"><img src="https://img.shields.io/github/actions/workflow/status/daqichen/react-contenteditable-autocomplete/.github%2Fworkflows%2Fchromatic.yml?branch=main&style=flat-square" alt="Build status" /></a>
  <a href="https://github.com/daqichen/react-contenteditable-autocomplete"><img src="https://img.shields.io/github/issues-search?query=repo%3Adaqichen%2Freact-contenteditable-autocomplete%20is%3Aopen&label=Open%20issues&style=flat-square" alt="Open issues" /></a>
</p>
 
<p align="center">
  <a href="https://codesandbox.io/p/sandbox/react-contenteditable-autocomplete-demo-jrqmz9"><img src="https://img.shields.io/badge/Demo-CodeSandbox-black?style=for-the-badge"></a>
  <a href="https://tinyurl.com/react-autocomplete-demo"><img src="https://img.shields.io/badge/Docs-Storybook-pink?style=for-the-badge"></a>
</p>

A flexible and customizable React component that provides a content-editable `<div>` for user input, ideal for autocomplete and rich text scenarios.

Built using Rslib.

## Installation

```bash
npm i react-custom-autocomplete
```

## Usage - Plaintext

<a href="https://codesandbox.io/p/sandbox/react-contenteditable-autocomplete-demo-jrqmz9"><img src="https://img.shields.io/badge/Demo-CodeSandbox-black?style=for-the-badge"></a>

```js
import { AutocompleteContentEditable } from "react-content-editable-autocomplete";

const onSelectMenuItem = (item: Menu.Item) =>
	console.log("Menu item selected:", item);

const onSearchFruits = (value: string) => {
	// Simulate search results
	return [
		{ label: "Apple", value: "apple", icon: <span>&#x1F34E;</span> },
		{ label: "Banana", value: "banana", icon: <span>&#x1F34C;</span> },
		{ label: "Cherry", value: "cherry", icon: <span>&#x1F352;</span> },
		// ...
	].filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));
};

<AutocompleteContentEditable
	onSelectMenuItem={onSelectMenuItem}
	placeholder='Search for fruits, start query with "/"'
	searchTrigger='/'
	style={{
		width: "50vw",
		background: "white",
	}}
	onSearch={onSearchFruits}
	value=''
/>;
```

## Usage - Custom HTML Tag

<a href="https://codesandbox.io/p/sandbox/react-contenteditable-autocomplete-demo-jrqmz9"><img src="https://img.shields.io/badge/Demo-CodeSandbox-black?style=for-the-badge"></a>

In some cases, you want to apply special styling to the autocompleted terms, or a different HTML tag altogether (i.e. anchor `<a>` or button `<button>` tag), that's where using `contenteditable` div for the underlying textarea comes in handy, it allows for raw HTML (with developer-imposed restrictions in this case to prevent Cross-Site Scripting attack) to be rendered directly inside the textarea div.

Here's an example usage:

```js
import { AutocompleteContentEditable } from "react-content-editable-autocomplete";
import { AutocompleteContentEditable as AutocompleteContentEditableType } from "react-content-editable-autocomplete/dist/types/AutocompleteContentEditable";

const tags = [
	{ label: "#Lifestyle", value: "lifestyle" },
	{ label: "#Technology", value: "technology" },
	// ...
];

const onSearchTags = (value: string) => {
	// Simulate search results
	return value && value.length > 0
		? tags.filter((item) =>
				item.label.toLowerCase().includes(value.toLowerCase())
		  )
		: tags;
};

const SelectionCustomization: AutocompleteContentEditableType.SelectionHTMLTag<"i"> =
	{
		HTMLTag: "i",
		HTMLInlineStyle: {
			padding: "5px 10px",
			fontSize: "12px",
			backgroundColor: "#e3edf9",
			borderRadius: "16px",
			color: "#4d80c5",
		},
		HTMLClassName: "custom-tag-class",
	};

<AutocompleteContentEditable
	onSelectMenuItem={onSelectMenuItem}
	placeholder='Search for tags, start query with "#"'
	searchTrigger='#'
	// renderMenuItem={TagMenuItemCustomRendering}
	style={{
		width: "60vw",
		background: "white",
	}}
	showSelectionAsHTMLTag={SelectionCustomization}
	onSearch={onSearchTags}
	value=''
/>;
```

<!--
## Features

- **Content-editable input:** Users can type and edit text directly.
- **Placeholder support:** Displays placeholder text when empty.
- **Focus and input handling:** Manages focus state and input events for a smooth user experience.
- **Ref-based content management:** Uses React refs to control and access the editable content.
- **Parent communication:** Notifies parent components of input changes.
- **Customizable styles:** Accepts custom class names and inline styles; adapts to light/dark themes.
- **Autocomplete ready:** Designed for use with suggestion/autocomplete lists.
- **TypeScript support:** Fully typed props and state for safety and clarity.
- **Accessibility:** Keyboard and screen reader friendly.
- **Performance optimized:** Handles large text efficiently.
- **Tested and reliable:** Works across major browsers and devices.
- **Reusable and extendable:** Easily integrated and extended for various use cases.
- **Minimal dependencies:** Lightweight and easy to add to any project.
- **Responsive:** Adapts to different screen sizes and orientations.
- **Integration friendly:** Works with state management libraries (e.g., Redux, MobX) and build tools (Webpack, Parcel).
- **Supports controlled/uncontrolled usage:** Flexible for different form management strategies.
- **Rich text ready:** Can be extended to support rich text formats.
- **Well-documented:** Includes clear comments, usage examples, and API references.
- **Internationalization:** Easily localized for multiple languages.
- **Versioned and maintainable:** Structured for easy updates and long-term maintenance. -->

## Local Dev Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library:

```bash
pnpm build
```

Build the library in watch mode:

```bash
pnpm dev
```
