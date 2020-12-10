import diff from "./diff";

export default function render(
  vNode,
  container,
  oldDom = container.firstChild
) {
  diff(vNode, container, oldDom);
}
