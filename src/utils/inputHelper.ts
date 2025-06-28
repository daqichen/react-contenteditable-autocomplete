export const getCursorPosition = (ele: HTMLDivElement) => {
    const target = document.createTextNode("\u0001");
    document.getSelection()?.getRangeAt(0).insertNode(target);
    const position = ele.innerHTML.indexOf("\u0001");
    target.parentNode?.removeChild(target);
    return position;
}

export const AnchorWrapper = (
  text: string,
  link?: string,
  identifier?: string,
  className?: string,
  backgroundColor?: string,
) =>
  ` <a contenteditable="false" href="${link}"${link ? ` target="_blank"` : ""}${identifier ? ` data-identifier="${identifier}"` : ""} ${className ? `class="${className}"` : ""} style="${!link ? "pointer-events:none;" : ""}${backgroundColor ? `background-color:${backgroundColor};` : ""}cursor:default;text-decoration:underline;">${text}</a> `;

// export const isActiveWithinMenu = () =>
//   document.activeElement?.id === "typeahead-quarter-year-picker" ||
//   document.activeElement?.id === "typeahead-quarter-year-input" ||
//   document.activeElement?.parentElement?.parentElement?.parentElement?.id ===
//     "typeahead-tabs";

export function debounce(func: any, wait: number) {
  let timeout: number;
  return function (...arg: any) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...arg);
    }, wait);
  };
}

export function throttle(func: any, interval: number) {
  let inThrottle: boolean = false;
  return function (...arg: any) {
    if (!inThrottle) {
      inThrottle = true;
      func(...arg);
      setTimeout(() => (inThrottle = false), interval);
    }
  };
}

export const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export function getCoordinates() {
  const target = document.createTextNode("\u0001");
  if (document.activeElement?.id !== "library-internal-content-editable") return null;
  document.getSelection()?.getRangeAt(0).insertNode(target);
  // Get coordinates via Range
  const range = document.createRange();
  range.selectNode(target);
  const result = range.getBoundingClientRect();
  target.parentNode?.removeChild(target);
  return result;
}

//find the child node and relative position and set it on range
export function findingRange(
  ind: number,
  nodes: NodeListOf<ChildNode>,
  position: number,
) {
  if (!nodes[ind]) {
    console.log("break condition hit: ", nodes[0], position);
    return { node: nodes[0], offset: position };
  }
  if (nodes[ind].textContent && nodes[ind].textContent.length >= position) {
    if (nodes[ind].childNodes.length > 0) {
      console.log("has child nodes", 0, nodes[ind].childNodes, position);
      return findingRange(0, nodes[ind].childNodes, position);
    }
    const node =
      nodes[ind].nodeType === Node.TEXT_NODE
        ? nodes[ind]
        : nodes[ind].firstChild;
    console.log("returning", node, position);
    return { node, offset: position };
  }

console.log(
    "iterate with: ",
    ind + 1,
    nodes,
    position - (nodes[ind].textContent ? nodes[ind].textContent.length : 0),
);
  return findingRange(
    ind + 1,
    nodes,
    position - (nodes[ind].textContent ? nodes[ind].textContent.length : 0),
  );
}

export function placeCaretAtEnd(el: HTMLElement) {
  el.focus();
  if (
    typeof window.getSelection != "undefined" &&
    typeof document.createRange != "undefined"
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

export function setCurrentCursorPosition(chars: number, element: HTMLElement) {
  if (chars >= 0) {
    const selection = window.getSelection();

    const range = _createRange(element, { count: chars });

    if (range) {
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}

export function extractDataIdentifer(innerHtml: string): string[] {
  const regex = /data-identifier="([^"]*)"/g;
  const matches = Array.from(innerHtml.matchAll(regex));
  const identifiers: string[] = [];

  for (const match of matches) {
    if (match[1]) {
      identifiers.push(match[1]);
    }
  }

  // console.log('identifiers: ', identifiers);
  return identifiers;
}

function _createRange(
  node: ChildNode,
  chars: { count: number },
  range?: Range,
): Range {
  if (!range) {
    range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent && node.textContent.length < chars.count) {
        chars.count -= node.textContent.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (let lp = 0; lp < node.childNodes.length; lp++) {
        range = _createRange(node.childNodes[lp], chars, range);

        if (chars.count === 0) {
          break;
        }
      }
    }
  }

  return range;
}
