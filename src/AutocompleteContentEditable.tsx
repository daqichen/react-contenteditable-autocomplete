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
    preserveSearchTrigger = false,
    onSearch,
    onKeyDown,
    placeholder = 'Type here...',
    className = '',
    style = {},
    onSelectMenuItem = () => { },
    searchDelay = 300,
    renderMenuItem,
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number | null; left: number | null }>({ top: null, left: null });
    const [internalMenuItems, setInternalMenuItems] = useState<MenuClass.Item[]>([]);
    const [internalSearchTerm, setInternalSearchTerm] = useState<string>('');
    const [internalCursorPosition, setInternalCursorPosition] = useState<number>(-1);
    const [activeMenuItemId, setActiveMenuItemId] = useState<number>(0);

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
        // if (onSearch) {
        //     onSearch(innerContentEditableRef.current?.textContent || '');
        // }
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
            const newContent = `${contentBeforeSearchTrigger}${preserveSearchTrigger ? searchTrigger : ''}${item.label}${contentAfterCursor}`;
            contentEditableRef.current.innerHTML = sanitizeHtml(newContent, strictHTMLSanitization);
            setCurrentCursorPosition(contentBeforeSearchTrigger.replace(/<[^>]+>/g, "").length + item.label.length + (preserveSearchTrigger ? searchTrigger.length : 0), contentEditableRef.current);
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
                renderMenuItem={renderMenuItem}
                style={{ display: 'none' }} // Initially hidden, should be shown based on search input
                activeId={activeMenuItemId}
            />
        </>
    );
};

AutocompleteContentEditable.displayName = 'AutocompleteContentEditable';
export default AutocompleteContentEditable;