import { FC, forwardRef } from 'react';
import { Menu as MenuClass } from '../types/Menu';
import './Menu.css';

const Menu: FC<MenuClass.Props> = forwardRef<HTMLDivElement, MenuClass.Props>(({
    items,
    onSelectMenuItem,
    position,
    renderMenuItem,
    searchTerm,
    activeId
}, ref: MenuClass.Reference) => {

  const renderItemLabel = (item: MenuClass.Item, index: number) => {
    if (renderMenuItem) {
      return renderMenuItem(item, index);
    }
    if (searchTerm !== '') {
      const highlightedLabel = item.label.replace(new RegExp(`(${searchTerm})`, 'gi'), '<strong>$1</strong>');
      return <span dangerouslySetInnerHTML={{ __html: highlightedLabel }} />;
    }
    return item.label;
  };

  return (
    <div className="autocomplete-content-editable-menu" ref={ref} style={{ position: 'absolute', top: position.top ?? -9999, left: position.left ?? -9999, zIndex: 9999 }}>
      <ul>
        {items.map((item, i) => (
          <li key={i} onClick={() => onSelectMenuItem(item)} className={activeId === i ? 'active' : ''} data-value={item.value} data-label={item.label} data-disabled={item.disabled ? 'true' : 'false'}>
            {item.icon && (typeof item.icon === 'string' ? <img src={item.icon} alt="" className="menu-icon" /> : <span className="menu-icon">{item.icon}</span>)}
            {renderItemLabel(item, i)}
          </li>
        ))}
      </ul>
    </div>
  );
});

Menu.displayName = 'Menu';
export default Menu;