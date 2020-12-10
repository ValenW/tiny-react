import { setDomAttribute } from "./elementProps";

export default function mountElement(vNode, container, oldDom) {
  // component's type is function
  if (typeof vNode.type === "function") {
    const type = vNode.type;
    let renderVNode = null;
    if (type.prototype && typeof type.prototype.render === "function") {
      const comp = new type(vNode.props);
      renderVNode = comp.render(vNode.props || {});
      renderVNode.component = comp.constructor;
      renderVNode.componentInstance = comp;
    } else {
      renderVNode = type(vNode.props || {});
      renderVNode.component = type;
    }
    mountElement(renderVNode, container, oldDom);
  } else {
    const dom = createDOMElement(vNode);
    oldDom ? container.replaceChild(dom, oldDom) : container.appendChild(dom);
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
  if (vNode.componentInstance) {
    vNode.componentInstance.dom = element;
  }
  return element;
}
