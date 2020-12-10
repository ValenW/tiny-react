import { setDomAttribute } from "./elementProps";

export default function mountElement(vNode, container) {
  // component's type is function
  if (typeof vNode.type === "function") {
    const type = vNode.type;
    let renderVNode = null;
    if (type.prototype && typeof type.prototype.render === "function") {
      const comp = new type(vNode.props);
      renderVNode = comp.render(vNode.props || {});
      renderVNode.component = comp;
    } else {
      renderVNode = type(vNode.props || {});
    }
    mountElement(renderVNode, container);
  } else {
    container.appendChild(createDOMElement(vNode));
  }
}

export function createDOMElement(vNode) {
  let element = null;
  if (vNode.type === "text") {
    element = document.createTextNode(vNode.props.textContent);
  } else {
    element = document.createElement(vNode.type, vNode.props);
    setDomAttribute(element, vNode.props);
  }
  vNode.children.forEach((child) => mountElement(child, element));
  element._vNode = vNode;
  if (vNode.component) {
    vNode.component.dom = element;
  }
  return element;
}
