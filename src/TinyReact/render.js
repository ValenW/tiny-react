import diff from "./diff";

export default function render(vNode, container, oldDom) {
  diff(vNode, container, oldDom);
}
