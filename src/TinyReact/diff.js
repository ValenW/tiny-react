import mountElement, { createDOMElement } from "./mountElement";
import { updateDomAttribute, getEventName } from "./elementProps";

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
    // TODO replace with insertBefore and remove
    container.replaceChild(createDOMElement(vNode), oldDom);
  }
}

function updateChildren(oldDom, vNode, oldVNode) {
  const keyDoms = Array.from(oldDom.childNodes).reduce((acc, cur) => {
    if (cur.nodeType === 1) {
      const key = cur.getAttribute("key");
      if (typeof key === "string" || typeof key === "number") {
        acc[key] = cur;
      }
    }
    return acc;
  }, {});

  if (Object.keys(keyDoms).length === 0) {
    vNode.children.forEach((c, i) => diff(c, oldDom, oldDom.childNodes[i]));
  } else {
    vNode.children.forEach((child, index) => {
      const ondIndexDom = oldDom.childNodes[index];
      if (child.props && typeof child.props.key !== "undefined") {
        const key = child.props.key;
        const keyDom = keyDoms[key];
        if (keyDom) {
          delete keyDoms[key];
          diff(child, oldDom, keyDom);
          if (ondIndexDom && ondIndexDom !== keyDom) {
            oldDom.insertBefore(keyDom, ondIndexDom);
          }
        } else {
          mountElement(child, oldDom, ondIndexDom);
        }
      } else {
        mountElement(child, oldDom, ondIndexDom);
      }
    });
    Object.values(keyDoms).forEach((dom) => unMount(dom));
  }

  const newLength = vNode.children.length;
  const oldLength = oldDom.childNodes.length;
  for (let i = oldLength; i >= newLength && i >= 0; i--) {
    oldDom.childNodes[i] && unMount(oldDom.childNodes[i]);
  }
}

function updateComponent(vNode, container, oldDom) {
  let newVNode = null;
  const nextProps = vNode.props;
  if (typeof vNode.type.prototype.render !== "function") {
    newVNode = vNode.type(nextProps || {});
    newVNode.component = vNode.type;
    diff(newVNode, container, oldDom);
    return;
  }

  const oldInstance = oldDom._vNode.componentInstance;
  const prevProps = oldInstance.props;
  // TODO implement state
  const preState = {};
  const nextState = {};

  oldInstance.componentWillReceiveProps(nextProps);
  if (oldInstance.shouldComponentUpdate(nextProps, nextState)) {
    oldInstance.componentWillUpdate(nextProps, nextState);
    oldInstance.updateProps(nextProps);
    newVNode = oldInstance.render();
    newVNode.componentInstance = oldInstance;
    newVNode.component = vNode.type;
    diff(newVNode, container, oldDom);
    oldInstance.componentDidUpdate(prevProps, preState);
  }
}

function unMount(dom) {
  const vNode = dom._vNode;
  const props = vNode.props;
  if (props.ref) {
    props.ref(null);
  }
  if (vNode.componentInstance) {
    vNode.componentInstance.componentWillUnmount();
  }
  Object.keys(props).forEach((prop) => {
    const eventName = getEventName(prop);
    if (eventName) {
      dom.removeEventListener(prop, props[prop]);
    }
  });
  for (let i = dom.childNodes.length - 1; i >= 0; i--) {
    dom.childNodes[i].remove();
  }
  dom.remove();
}
