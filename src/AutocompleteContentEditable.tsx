import React, { useState, useRef, useEffect, FormEvent } from 'react';
import './AutocompleteContentEditable.css';
import { AutocompleteContentEditable as AutocompleteContentEditableClass } from './types/AutocompleteContentEditable';
import ContentEditable from './ContentEditable/ContentEditable';
import Menu from './Menu/Menu';
import sanitizeHtml from 'sanitize-html';
import { getCursorPosition } from './utils/inputHelper';

const strictHTMLSanitization = {
    allowedTags: [],
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
    items = [],
    onSelectMenuItem = () => { },
    renderItem,
}) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: null, left: null });

    const removeMenu = () => {
        if (menuRef.current) {
            setMenuPosition({ top: null, left: null });
        }
    };

    const onInputChange = (evt: FormEvent<HTMLDivElement>) => {
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
        const strippedContentUpToCursor = sanitizeHtml(innerHTML.slice(0, position), strictHTMLSanitization);

        const lastSearchTerm = strippedContentUpToCursor.split(searchTrigger).pop()?.trim() || '';
        console.log('Last search term:', lastSearchTerm);
        if (strippedContent && strippedContent.startsWith(searchTrigger)) {
            const query = strippedContent.slice(searchTrigger.length).trim();
            onSearch?.(query);
        }
    };

    return (
        <>
            <ContentEditable
                value={value}
                onChange={onInputChange}
                searchTrigger={searchTrigger} //TODO: Might not be needed here, but kept for consistency
                onSearch={onSearch} //TODO: Might not be needed here, but kept for consistency
                onSelect={onSelect}
                placeholder={placeholder}
                className={className}
                style={style}
                ref={contentEditableRef}
            />
            <Menu
                ref={menuRef}
                items={items} // This should be populated with actual items
                onSelectMenuItem={onSelectMenuItem}
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