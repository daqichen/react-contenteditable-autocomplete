import { useState, FC, forwardRef } from 'react';
import { Menu as MenuClass } from '../types/Menu';

const Menu: FC<MenuClass.Props> = forwardRef<HTMLDivElement, MenuClass.Props>(({
    items,
    onSelectMenuItem,
    position,
}, ref: MenuClass.Reference) => {

  return (
    <div className="autocomplete-content-editable-menu" ref={ref} style={{ position: 'absolute', top: position.top ?? -9999, left: position.left ?? -9999 }}>
      <ul>
        {items.map((item, i) => (
          <li key={i} onClick={(e) => onSelectMenuItem(e, item)}>
            {item.icon && <img src={item.icon} alt="" className="menu-icon" />}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default Menu;
