export default function createElement(type, props, ...childrenNode) {
  const children = childrenNode.reduce((acc, cur) => {
    if (cur !== false && cur !== true && cur !== null) {
      if (cur instanceof Object) {
        acc.push(cur);
      } else {
        acc.push(createElement("text", { textContent: cur }));
      }
    }
    return acc;
  }, []);
  return {
    type,
    props: { children, ...props },
    children,
  };
}
