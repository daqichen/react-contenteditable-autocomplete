import { FC, forwardRef } from 'react';
import { Menu as MenuClass } from '../types/Menu';
import './Menu.css';

const Menu: FC<MenuClass.Props> = forwardRef<HTMLDivElement, MenuClass.Props>(({
    items,
    onSelectMenuItem,
    position,
    renderItem,
    searchTerm,
}, ref: MenuClass.Reference) => {

  const renderItemLabel = (item: MenuClass.Item, index: number) => {
    if (renderItem) {
      return renderItem(item, index);
    }
    if (searchTerm !== '') {
      const highlightedLabel = item.label.replace(new RegExp(`(${searchTerm})`, 'gi'), '<strong>$1</strong>');
      return <span dangerouslySetInnerHTML={{ __html: highlightedLabel }} />;
    }
    return item.label;
  };

  return (
    <div className="autocomplete-content-editable-menu" ref={ref} style={{ position: 'absolute', top: position.top ?? -9999, left: position.left ?? -9999 }}>
      <ul>
        {items.map((item, i) => (
          <li key={i} onClick={() => onSelectMenuItem(item)}>
            {item.icon && <img src={item.icon} alt="" className="menu-icon" />}
            {renderItemLabel(item, i)}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default Menu;
