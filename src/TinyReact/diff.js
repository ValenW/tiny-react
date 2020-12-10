import mountElement from "./mountElement";
import { updateDomAttribute } from "./elementProps";

export default function diff(vNode, container, oldDom) {
  const oldVNode = oldDom && oldDom._vNode;
  if (!oldDom || !oldVNode) {
    container.innerHTML = "";
    mountElement(vNode, container);
  } else if (oldVNode.type === vNode.type) {
    const type = vNode.type;
    if (typeof type === "function") {
      // 更新组件
    } else if (type === "text") {
      if (vNode.props.textContent !== oldVNode.props.textContent) {
        oldDom.textContent = vNode.props.textContent;
        oldDom._vNode = vNode;
      }
    } else {
      updateDomAttribute(oldDom, vNode, oldVNode);
      updateChildren(oldDom, vNode, oldVNode);
    }
  }
}

function updateChildren(oldDom, vNode, oldVNode) {
  vNode.children.forEach((c, i) => diff(c, oldDom, oldDom.childNodes[i]));
}
