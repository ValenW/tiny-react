import mountElement from "./mountElement";

export default function diff(vNode, container, oldDom) {
  if (!oldDom) {
    mountElement(vNode, container);
  }
}
