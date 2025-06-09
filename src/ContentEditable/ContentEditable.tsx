import { FC, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './ContentEditable.css';
import { ContentEditable as ContentEditableClass } from '../types/ContentEditable';
import sanitizeHtml from 'sanitize-html';

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableClass.Props>(({
    value,
    onChange,
    searchTrigger = '/',
    onSearch,
    onSelect,
    placeholder = 'Type here...',
    className = '',
    style = {},
}, ref: ContentEditableClass.Reference) => {
    const [isFocused, setIsFocused] = useState(false);
    const innerContentEditableRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => innerContentEditableRef.current! as HTMLDivElement, []);

    // useEffect(() => {
    //     if (innerContentEditableRef.current) {
    //         innerContentEditableRef.current.textContent = value;
    //     }
    // }, [value]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // e.preventDefault();
        if (e.key === 'Enter' && onSelect) {
            // e.preventDefault();
            onSelect(innerContentEditableRef.current?.textContent || '');
        }
        // if (onSearch) {
        //     onSearch(innerContentEditableRef.current?.textContent || '');
        // }
    };

    return (
        <div
            ref={innerContentEditableRef}
            className={`autocomplete-content-editable-default ${className} ${isFocused ? 'focused' : ''}`}
            contentEditable
            suppressContentEditableWarning
            onInput={onChange}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={style}
            data-placeholder={placeholder}
        />
    );
});

ContentEditable.displayName = 'ContentEditable';
export default ContentEditable;