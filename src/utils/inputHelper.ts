export const getCursorPosition = (ele: HTMLDivElement) => {
    const target = document.createTextNode("\u0001");
    document.getSelection()?.getRangeAt(0).insertNode(target);
    const position = ele.innerHTML.indexOf("\u0001");
    target.parentNode?.removeChild(target);
    return position;
}