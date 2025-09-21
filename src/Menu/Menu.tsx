import { FC, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Menu as MenuClass } from "../types/Menu";
import "./Menu.css";
import clsx from "clsx";

const Menu: FC<MenuClass.Props> = forwardRef<HTMLDivElement, MenuClass.Props>(
	(
		{
			activeId,
			items,
			onSelectMenuItem,
			position,
			renderMenuItem,
			rootClassName,
			searchTerm,
			...props
		},
		ref: MenuClass.Reference
	) => {
		const renderItemLabel = (item: MenuClass.Item, index: number) => {
			if (renderMenuItem) {
				return renderMenuItem(item, index);
			}
			if (searchTerm !== "") {
				const highlightedLabel = item.label.replace(
					new RegExp(`(${searchTerm})`, "gi"),
					"<strong>$1</strong>"
				);
				return <span dangerouslySetInnerHTML={{ __html: highlightedLabel }} />;
			}
			return item.label;
		};

		const findClosestRoot = (): Element => {
			if (ref && "current" in ref && ref.current) {
				return ref.current.closest(`.${rootClassName}`) ?? document.body;
			}
			return document.body;
		};

		return (
			<div
				ref={ref}
				id='autocomplete-content-editable-menu'
			>
				{createPortal(
					<div
						className={clsx(
							"autocomplete-content-editable-menu",
							props.className
						)}
						style={{
							inset: "0px auto auto 0px",
							transform: `translate3d(${position.left ?? -9999}px, ${
								position.top ?? -9999
							}px, 0px)`,
							position: "fixed",
							zIndex: 9999,
						}}
					>
						<ul>
							{items.map((item, i) => (
								<li
									className={clsx({
										active: activeId === i,
										disabled: item.disabled,
									})}
									data-disabled={item.disabled ? "true" : "false"}
									data-label={item.label}
									data-value={item.value}
									key={i}
									onClick={() => onSelectMenuItem(item)}
								>
									{item.icon &&
										(typeof item.icon === "string" ? (
											<img
												alt={`${item.label} icon`}
												className='menu-icon'
												src={item.icon}
											/>
										) : (
											<span className='menu-icon'>{item.icon}</span>
										))}
									{renderItemLabel(item, i)}
								</li>
							))}
						</ul>
					</div>,
					findClosestRoot()
				)}
			</div>
		);
	}
);

Menu.displayName = "Menu";
export default Menu;
