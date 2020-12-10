import TinyReact from "./TinyReact";

const root = document.getElementById("root");

const FunctionComp = (props) => (
  <div>
    -- Function
    <Heart /> <br />
    {props.title}
    Hello -- Function End
  </div>
);

class ClassComp extends TinyReact.Component {
  constructor(props) {
    super(props);
    this.state = { title: "original" };
  }
  render() {
    return (
      <div>
        -- class
        <FunctionComp />
        <div>
          <h1>Hello</h1>
          {this.props.name}
          {this.props.code}
          <br />
          {this.state.title}
          <button onClick={() => this.setState({ title: "changed" })}>
            change title
          </button>
        </div>
        <Heart />
        -- class end
      </div>
    );
  }
}

const Heart = () => <div>&hearts;</div>;

const refs = {};

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
    <button
      onClick={() => {
        alert("你好");
        console.log(refs);
      }}>
      点击我
    </button>
    <h1>这个将会被删除</h1>
    2, 3<br />
    <input type="text" value="123" ref={(i) => (refs.i = i)} />
    <FunctionComp title="old" ref={(i) => (refs.f = i)} />
    <ClassComp name="name" code={"code"} ref={(i) => (refs.c = i)} />
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
    <FunctionComp title="new" />
    <ClassComp name="name1" code={"code2"} />
  </div>
);

TinyReact.render(virtualDOM, root);

setTimeout(() => {
  // TinyReact.render(updatedDOM, root);
}, 2000);
