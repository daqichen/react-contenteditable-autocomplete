import React, { useState, useRef, useEffect, FormEvent, useMemo } from 'react';
import { AutocompleteContentEditable as AutocompleteContentEditableClass } from './types/AutocompleteContentEditable';
import ContentEditable from './ContentEditable/ContentEditable';
import Menu from './Menu/Menu';
import sanitizeHtml from 'sanitize-html';
import { debounce, TagWrapper, getCoordinates, getCursorPosition, placeCaretAtEnd, setCurrentCursorPosition, throttle } from './utils/inputHelper';
import { Menu as MenuClass } from './types/Menu';

export const AutocompleteContentEditable: React.FC<AutocompleteContentEditableClass.Props> = ({
    value,
    onChangeInput,
    searchTrigger = '/',
    preserveSearchTrigger = false,
    onSearch,
    onKeyDown,
    placeholder = 'Type here...',
    menuClassName = '',
    menuStyle = {},
    onSelectMenuItem = () => { },
    showSelectionAsHTMLTag = false,
    searchDelay = 300,
    renderMenuItem,
    ...props
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number | null; left: number | null }>({ top: null, left: null });
    const [internalMenuItems, setInternalMenuItems] = useState<MenuClass.Item[]>([]);
    const [internalSearchTerm, setInternalSearchTerm] = useState<string>('');
    const [internalCursorPosition, setInternalCursorPosition] = useState<number>(-1);
    const [activeMenuItemId, setActiveMenuItemId] = useState<number>(0);

    const strictHTMLSanitization = useMemo(() => {
        // Sanitize HTML to allow only specific tags and attributes
        const allowedAttributeAppendix = typeof showSelectionAsHTMLTag === 'object' && showSelectionAsHTMLTag.HTMLTag !== "a" ? {
            [showSelectionAsHTMLTag.HTMLTag]: ['class', 'style'] // Allow class and style attributes for the custom HTML tag
        } : {};
        return {
            allowedTags: ['br', 'b', 'i', 'u', 'strong', 'em', 'p', 'div', 'span', 'a'],
            allowedAttributes: {
                'a': ['href', 'target', 'data-identifier', 'class', 'style'],
                ...allowedAttributeAppendix, // Append custom HTML tag attributes if provided
            },
        };
    }, [showSelectionAsHTMLTag]);

    const SELECTION_TAG_IF_SET = useMemo(() => (typeof showSelectionAsHTMLTag === 'object' && showSelectionAsHTMLTag.HTMLTag)? showSelectionAsHTMLTag.HTMLTag : showSelectionAsHTMLTag === true ? 'a' : null, [showSelectionAsHTMLTag]);

    useEffect(() => {
        document.addEventListener('click', removeMenu);
        document.addEventListener('scroll', removeMenu); // Remove menu on scroll to avoid it staying open when scrolling the page
        window.addEventListener('resize', removeMenu); // Remove menu on resize to avoid it staying open when resizing the window
        return () => {
            document.removeEventListener('click', removeMenu);
            document.removeEventListener('scroll', removeMenu);
            window.removeEventListener('resize', removeMenu);
        }
    },[]);

    const removeMenu = throttle(() => {
        if (menuRef.current) {
            setMenuPosition({ top: null, left: null });
            setActiveMenuItemId(0);
        }
    }, 100);

    const internalOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!contentEditableRef.current) return;
        if (onKeyDown) {
            onKeyDown(e);
        }
        // delete the anchor tag if the user presses backspace or delete
        if ((e.key === 'Backspace' || e.key === 'Delete') && SELECTION_TAG_IF_SET) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedNode = range.startContainer;
                if (selectedNode.nodeType === Node.TEXT_NODE) {
                    const parentNode = selectedNode.parentNode;
                    if (parentNode && parentNode.nodeName === SELECTION_TAG_IF_SET.toLocaleUpperCase() && parentNode.textContent) {
                        e.preventDefault(); // Prevent default backspace/delete behavior
                        // const anchorText = parentNode.textContent;
                        // Remove the anchor tag fully
                        parentNode.parentNode?.removeChild(parentNode);
                    }
                }
            }
        }
        if (menuPosition.top !== null && menuPosition.left !== null) {
            // If the menu is open, handle key events for navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveMenuItemId((prevId) => {
                    const newId = e.key === 'ArrowDown' ? prevId + 1 : prevId - 1;
                    if (newId < 0) return 0; // Prevent going below 0
                    if (newId >= internalMenuItems.length) return internalMenuItems.length - 1; // Prevent going above the last item
                    return newId;
                }
                );
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (internalMenuItems.length > 0 && internalMenuItems[activeMenuItemId]) {
                    internalOnSelect(internalMenuItems[activeMenuItemId]);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                removeMenu();
            }
        }
    };

    const internalOnChange = (evt: FormEvent<HTMLDivElement>) => {
        evt.preventDefault();
        if (!contentEditableRef.current) return;
        onChangeInput?.(evt); // Call the onChangeInput prop if provided
        const { innerHTML } = evt.currentTarget;
        // Sanitize the innerHTML to prevent XSS attacks
        const strippedContent = sanitizeHtml(innerHTML, strictHTMLSanitization);
        // Remove menu if no search trigger is found
        if (!strippedContent.includes(searchTrigger)) {
            removeMenu();
            return;
        }
        // If the content starts with the search trigger, extract the query
        const position = getCursorPosition(contentEditableRef.current);
        setInternalCursorPosition(position);
        const strippedContentUpToCursor = sanitizeHtml(innerHTML.slice(0, position), strictHTMLSanitization);

        const lastSearchTerm = strippedContentUpToCursor.split(/<[^>]*>|\s+/gm).pop()?.startsWith(searchTrigger) ? strippedContentUpToCursor.split(/<[^>]*>|\s+/gm).pop()?.slice(searchTrigger.length).trim() ?? '' : undefined;
        if (lastSearchTerm === undefined) return removeMenu();

        setInternalSearchTerm(lastSearchTerm);

        debounce(() => {// If the last search term is empty, remove the menu
            if (strippedContent) {
                const results = onSearch?.(lastSearchTerm);
                if (results && results.length > 0) {
                    const coordinates = getCoordinates();
                    setMenuPosition({
                        top: coordinates?.top ?? null,
                        left: coordinates?.left ?? null
                    });
                    setInternalMenuItems(results);
                } else {
                    removeMenu();
                }
            } else {
                removeMenu();
            }
        }, searchDelay)();
    };

    const internalOnSelect = (item: MenuClass.Item) => {
        if (onSelectMenuItem) {
            onSelectMenuItem(item);
        }
        // Update the contentEditable with the selected item
        if (contentEditableRef.current) {
            const currentContent = contentEditableRef.current.innerHTML;
            const contentBeforeCursor = currentContent.slice(0, internalCursorPosition);
            // Replace the last search term with the selected item
            const lastSearchTermIndex = contentBeforeCursor.lastIndexOf(searchTrigger);
            const contentBeforeSearchTrigger = contentBeforeCursor.slice(0, lastSearchTermIndex);
            // Construct the new content
            const contentAfterCursor = currentContent.slice(internalCursorPosition);
            const newContent = `${contentBeforeSearchTrigger}${TagWrapper((preserveSearchTrigger ? searchTrigger : '') + item.label, showSelectionAsHTMLTag)}${contentAfterCursor}`;
            contentEditableRef.current.innerHTML = sanitizeHtml(newContent, strictHTMLSanitization);

            if (showSelectionAsHTMLTag === false) {
                setCurrentCursorPosition(
                    contentBeforeSearchTrigger.replace(/<[^>]+>/g, "").length + 
                    item.label.length + 
                    (preserveSearchTrigger ? searchTrigger.length : 0),
                    contentEditableRef.current
                );
            } else {
                const range = document.createRange();
                const selection = window.getSelection();
                let targetChild: ChildNode;

                Array.from(contentEditableRef.current.childNodes).forEach((node, id) => {
                    if (node.textContent?.indexOf(item.label) !== -1 && contentEditableRef.current) {
                        targetChild = Array.from(contentEditableRef.current.childNodes)?.[id + 1]; // +1 because target is the text node following the custom node (default to anchor) containing '&nbsp;'

                        // Find the position of the targetChild
                        if (targetChild) {
                            range.setStart(targetChild, targetChild.textContent ? 1 : 0);
                            range.collapse(true);
                            selection?.removeAllRanges();
                            selection?.addRange(range);
                            contentEditableRef.current.focus();
                        } 
                    }
            });

            }
        }
        // Remove the menu after selection
        setInternalMenuItems([]);
        removeMenu();
    };

    return (
        <>
            <ContentEditable
                value={value}
                onChange={internalOnChange}
                onKeyDown={internalOnKeyDown}
                placeholder={placeholder}
                ref={contentEditableRef}
                {...props}
            />
            <Menu
                ref={menuRef}
                searchTerm={internalSearchTerm}
                items={internalMenuItems} // This should be populated with actual items
                onSelectMenuItem={internalOnSelect}
                position={menuPosition} // Position should be calculated based on the contentEditable position
                className={"autocomplete-menu" + (menuClassName ? ` ${menuClassName}` : '')}
                style={menuStyle}
                renderMenuItem={renderMenuItem}
                activeId={activeMenuItemId}
            />
        </>
    );
};

AutocompleteContentEditable.displayName = 'AutocompleteContentEditable';
export default AutocompleteContentEditable;