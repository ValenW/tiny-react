import TinyReact from "./TinyReact";

const root = document.getElementById("root");

const FunctionComp = (props) => (
  <div>
    <Heart />
    Hello
  </div>
);

class ClassComp extends TinyReact.Component {
  render() {
    return (
      <div>
        <FunctionComp />
        <div>
          <h1>Hello</h1>
          {this.props.name}
          {this.props.code}
        </div>
        <Heart />
      </div>
    );
  }
}

const Heart = () => <div>&hearts;</div>;

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2>(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h2>(观察: 这个将会被改变)</h2>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h1>这个将会被删除</h1>
    2, 3<br />
    <input type="text" value="123" />
    <FunctionComp />
    <ClassComp name="name" code={"code"} />
  </div>
);

const updatedDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2>(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(已被改变)</h3>
    {2 == 2 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 1 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好呀")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3<br />
    <input type="password" value="12345" />
    <FunctionComp />
    <ClassComp name="name1" code={"code2"} />
  </div>
);

TinyReact.render(virtualDOM, root);

setTimeout(() => {
  TinyReact.render(updatedDOM, root);
}, 2000);
