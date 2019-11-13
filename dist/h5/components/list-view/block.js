import Nerv from "nervjs";
import Taro, { Component } from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import './block.scss';
import storage from "../../utils/storage";
import tools from "./tool";
class LazyImage extends Component {
  constructor() {
    super(...arguments);
    this.lazyItem = {};
    this.state = {
      scrollCur: [0]
    };
  }
  componentDidMount() {
    this.lazyItem = storage.get('lazyBox')[storage.get('lazyBox').length - 1];
    this.bindTextListener();
  }
  componentWillUnmount() {
    const { key } = this.lazyItem;
    Taro.eventCenter.off(`lazyBlock${key}`);
  }
  // 绑定函数
  bindTextListener() {
    const { key, className, viewHeight } = this.lazyItem;
    Taro.eventCenter.on(`lazyBlock${key}`, scrollCur => {
      this.setState({
        scrollCur
      });
    });
    // @ts-ignore
    Taro[key] = Taro.eventCenter.trigger.bind(Taro.eventCenter, `lazyBlock${key}`);
    setTimeout(() => {
      tools.lazyScroll(key, className, viewHeight);
    }, 0);
  }
  render() {
    const { current } = this.props;
    return <View className={`lazy-image-${this.lazyItem.key} ${this.props.className} `}>
          {this.isLoad(current) ? <View className="blockLoad">
                  {this.props.children}
                </View> : ''}
        </View>;
  }
  isLoad = current => {
    return this.state.scrollCur.includes(current);
  };
}
LazyImage.options = {
  addGlobalClass: true
};
LazyImage.externalClasses = ['img-class'];
export default LazyImage;