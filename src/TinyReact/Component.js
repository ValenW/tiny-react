import diff from "./diff";

export default class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this._dom = null;
  }
  setState(state) {
    this.state = { ...this.state, ...state };
    const vNode = this.render();
    const oldDom = this.dom;
    diff(vNode, oldDom.parentNode, oldDom);
  }
  updateProps(props) {
    this.props = props;
  }
  set dom(dom) {
    this._dom = dom;
  }
  get dom() {
    return this._dom;
  }

  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state;
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
