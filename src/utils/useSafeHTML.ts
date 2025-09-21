import { AutocompleteContentEditable } from "../types/AutocompleteContentEditable";

const ALLOWED_TAGS = [
	"br",
	"b",
	"i",
	"u",
	"strong",
	"em",
	"p",
	"div",
	"span",
	"a",
];

const ALLOWED_ANCHOR_ATTRIBUTES = [
	"href",
	"target",
	"data-identifier",
	"class",
	"style",
];

export const useSafeHTML = (
	showSelectionAsHTMLTag:
		| boolean
		| AutocompleteContentEditable.SelectionHTMLTag<keyof HTMLElementTagNameMap>
) => {
	// Sanitize HTML to allow only specific tags and attributes
	const allowedAttributeAppendix =
		typeof showSelectionAsHTMLTag === "object" &&
		showSelectionAsHTMLTag.HTMLTag !== "a"
			? {
					[showSelectionAsHTMLTag.HTMLTag]: ["class", "style"], // Allow class and style attributes for the custom HTML tag
			  }
			: {};
	return {
		safetyConfig: {
			allowedTags: ALLOWED_TAGS,
			allowedAttributes: {
				a: ALLOWED_ANCHOR_ATTRIBUTES,
				...allowedAttributeAppendix, // Append custom HTML tag attributes if provided
			},
		},
		selectionTagIfSet:
			typeof showSelectionAsHTMLTag === "object" &&
			showSelectionAsHTMLTag.HTMLTag
				? showSelectionAsHTMLTag.HTMLTag
				: showSelectionAsHTMLTag === true
				? "a"
				: null,
	};
};
