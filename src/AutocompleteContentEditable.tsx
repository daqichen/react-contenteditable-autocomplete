import React, { useState, useRef, useEffect, FormEvent } from 'react';
import './AutocompleteContentEditable.css';
import { AutocompleteContentEditable as AutocompleteContentEditableClass } from './types/AutocompleteContentEditable';
import ContentEditable from './ContentEditable/ContentEditable';
import Menu from './Menu/Menu';
import sanitizeHtml from 'sanitize-html';
import { debounce, findingRange, getCoordinates, getCursorPosition, placeCaretAtEnd, setCurrentCursorPosition, throttle } from './utils/inputHelper';
import { Menu as MenuClass } from './types/Menu';

const strictHTMLSanitization = {
    allowedTags: ['br', 'b', 'i', 'u', 'strong', 'em', 'p', 'div', 'span'],
}

export const AutocompleteContentEditable: React.FC<AutocompleteContentEditableClass.Props> = ({
    value,
    onChangeInput,
    searchTrigger = '/',
    onSearch,
    onSelect,
    placeholder = 'Type here...',
    className = '',
    style = {},
    onSelectMenuItem = () => { },
    searchDelay = 300,
    renderItem,
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number | null; left: number | null }>({ top: null, left: null });
    const [internalMenuItems, setInternalMenuItems] = useState<MenuClass.Item[]>([]);
    const [internalSearchTerm, setInternalSearchTerm] = useState<string>('');
    const [internalCursorPosition, setInternalCursorPosition] = useState<number>(-1);

    const removeMenu = () => {
        if (menuRef.current) {
            setMenuPosition({ top: null, left: null });
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

        const lastSearchTerm = strippedContentUpToCursor.split(/<[^>]*>|\s+/gm).pop()?.startsWith(searchTrigger) ? strippedContentUpToCursor.split(/<[^>]*>|\s+/gm).pop()?.slice(searchTrigger.length).trim() ?? '' : '';
        // console.log('Last search term:', lastSearchTerm);
        setInternalSearchTerm(lastSearchTerm);

        debounce(() => {// If the last search term is empty, remove the menu
            if (strippedContent && lastSearchTerm !== '') {
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
        if (onSelect) {
            onSelect(item);
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
            const newContent = `${contentBeforeSearchTrigger}${item.label}${contentAfterCursor}`;
            contentEditableRef.current.innerHTML = sanitizeHtml(newContent, strictHTMLSanitization);
            setCurrentCursorPosition(contentBeforeSearchTrigger.replace(/<[^>]+>/g, "").length + item.label.length, contentEditableRef.current);
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
                // searchTrigger={searchTrigger} //TODO: Might not be needed here, but kept for consistency
                // onSearch={onSearch} //TODO: Might not be needed here, but kept for consistency
                onSelect={internalOnSelect}
                placeholder={placeholder}
                className={className}
                style={style}
                ref={contentEditableRef}
            />
            <Menu
                ref={menuRef}
                searchTerm={internalSearchTerm}
                items={internalMenuItems} // This should be populated with actual items
                onSelectMenuItem={internalOnSelect}
                position={menuPosition} // Position should be calculated based on the contentEditable position
                className="autocomplete-menu"
                renderItem={renderItem}
                style={{ display: 'none' }} // Initially hidden, should be shown based on search input
            />
        </>
    );
};

AutocompleteContentEditable.displayName = 'AutocompleteContentEditable';
export default AutocompleteContentEditable;