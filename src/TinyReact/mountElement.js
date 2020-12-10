export default function mountElement(vNode, container) {
  // component's type is function
  if (typeof vNode.type === "function") {
    const type = vNode.type;
    let render = type;
    if (type.prototype && typeof type.prototype.render === "function") {
      const comp = new type(vNode.props);
      render = comp.render.bind(comp);
    }
    mountElement(render(vNode.props || {}), container);
  } else {
    mountNativeElement(vNode, container);
  }
}

function mountNativeElement(vNode, container) {
  let element = null;
  if (vNode.type === "text") {
    element = document.createTextNode(vNode.props.textContent);
  } else {
    element = document.createElement(vNode.type, vNode.props);
    updateProps(element, vNode.props);
  }
  vNode.children.forEach((child) => mountElement(child, element));
  container.appendChild(element);
}

const PropNames = Object.freeze(["value", "checked"]);
function updateProps(element, props) {
  Object.keys(props).forEach((p) => {
    const value = props[p];
    if (p.startsWith("on")) {
      const eventName = p.slice(2).replace(/^\S/g, (c) => c.toLowerCase());
      element.addEventListener(eventName, value);
    } else if (PropNames.includes(p)) {
      element[p] = value;
    } else if (p !== "children") {
      element.setAttribute(p === "className" ? "class" : p, value);
    }
  });
}
