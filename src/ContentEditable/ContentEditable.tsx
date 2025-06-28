import { FC, useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './ContentEditable.css';
import { ContentEditable as ContentEditableClass } from '../types/ContentEditable';
import sanitizeHtml from 'sanitize-html';

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableClass.Props>(({
    value,
    onChange,
    placeholder = 'Type here...',
    className = '',
    style = {},
    ...props
}, ref: ContentEditableClass.Reference) => {
    const [isFocused, setIsFocused] = useState(false);
    const innerContentEditableRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => innerContentEditableRef.current! as HTMLDivElement, []);

    useEffect(() => {
        if (innerContentEditableRef.current) {
            innerContentEditableRef.current.textContent = value;
        }
    }, [value]);

    return (
        <div
            ref={innerContentEditableRef}
            id={"library-internal-content-editable"}
            className={`autocomplete-content-editable-default ${className} ${isFocused ? 'focused' : ''}`}
            contentEditable
            suppressContentEditableWarning
            onInput={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={style}
            data-placeholder={placeholder}
            {...props}
        />
    );
});

ContentEditable.displayName = 'ContentEditable';
export default ContentEditable;