import mountElement, { createDOMElement } from "./mountElement";
import { updateDomAttribute } from "./elementProps";

export default function diff(vNode, container, oldDom) {
  const oldVNode = oldDom && oldDom._vNode;
  if (!oldDom || !oldVNode) {
    container.innerHTML = "";
    mountElement(vNode, container);
  } else if (typeof vNode.type === "function") {
    const oldComponent = oldDom && oldDom._vNode.component;
    const sameComponent = vNode.type === oldComponent;
    if (!sameComponent) {
      mountElement(vNode, container, oldDom);
    } else {
      updateComponent(vNode, container, oldDom);
    }
  } else if (oldVNode.type === vNode.type) {
    if (vNode.type === "text") {
      if (vNode.props.textContent !== oldVNode.props.textContent) {
        oldDom.textContent = vNode.props.textContent;
        oldDom._vNode = vNode;
      }
    } else {
      updateDomAttribute(oldDom, vNode, oldVNode);
      updateChildren(oldDom, vNode, oldVNode);
    }
  } else {
    const newDOMElement = createDOMElement(vNode);
    container.replaceChild(newDOMElement, oldDom);
  }
}

function updateChildren(oldDom, vNode, oldVNode) {
  vNode.children.forEach((c, i) => diff(c, oldDom, oldDom.childNodes[i]));
  const newLength = vNode.children.length;
  const oldLength = oldVNode.children.length;
  for (let i = oldLength; i >= newLength && i >= 0; i--) {
    oldDom.childNodes[i] && oldDom.childNodes[i].remove();
  }
}

function updateComponent(vNode, container, oldDom) {
  let newVNode = null;
  if (typeof vNode.type.prototype.render === "function") {
    const oldInstance = oldDom._vNode.componentInstance;
    oldInstance.updateProps(vNode.props);
    newVNode = oldInstance.render();
    newVNode.componentInstance = oldInstance;
  } else {
    newVNode = vNode.type(vNode.props || {});
  }
  newVNode.component = vNode.type;
  diff(newVNode, container, oldDom);
}
