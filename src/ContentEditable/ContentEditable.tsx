import {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import "./ContentEditable.css";
import { ContentEditable as ContentEditableClass } from "../types/ContentEditable";
import clsx from "clsx";

export const ContentEditable = forwardRef<
	HTMLDivElement,
	ContentEditableClass.Props
>(
	(
		{
			value,
			onChange,
			placeholder = "Type here...",
			className,
			style,
			...props
		},
		ref: ContentEditableClass.Reference
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const innerContentEditableRef = useRef<HTMLDivElement>(null);

		useImperativeHandle(
			ref,
			() => innerContentEditableRef.current! as HTMLDivElement,
			[]
		);

		useEffect(() => {
			if (innerContentEditableRef.current) {
				innerContentEditableRef.current.textContent = value;
			}
		}, [value]);

		return (
			<div
				className={clsx("autocomplete-content-editable-default", className, {
					focused: isFocused,
				})}
				contentEditable
				data-placeholder={placeholder}
				id={"library-internal-content-editable"}
				onBlur={() => setIsFocused(false)}
				onFocus={() => setIsFocused(true)}
				onInput={onChange}
				ref={innerContentEditableRef}
				style={style}
				suppressContentEditableWarning
				{...props}
			/>
		);
	}
);

ContentEditable.displayName = "ContentEditable";
export default ContentEditable;
