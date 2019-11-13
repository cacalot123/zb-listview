import Nerv from "nervjs";
import { Component } from "@tarojs/taro-h5";
import { Image, View } from '@tarojs/components';
import './index.scss';
const emptyImg = require("./assets/empty.png");
class Page extends Component {
  render() {
    const { isError, launchError, launchEmpty, isEmpty, emptyText, fetchInit } = this.props;
    const showError = isError; // isErrorUI权重最高
    const showErrorText = showError && !launchError; // 渲染ErrorText
    const showRenderError = showError && launchError; // 渲染renderError
    const showEmpty = !isError && isEmpty; // isErrorUI权重最高
    const showEmptyText = showEmpty && !launchEmpty; // 渲染emptyText
    const showRenderEmpty = showEmpty && launchEmpty; // 渲染renderEmpty
    return <View>
        {showErrorText && <View className="errorPage">
            <View className="marginBottom30">啊哦，网络悄悄跑到外星球去了~</View>
            <View className="button" onClick={fetchInit}>
              重新加载
            </View>
          </View>}
        
        {showRenderError ? this.props.renderError : ''}
        
        {showEmptyText && <View className="noContentTips">
            <Image src={emptyImg} className="emptyBanner" />
            {emptyText}
          </View>}
        
        {showRenderEmpty ? this.props.renderEmpty : ''}
      </View>;
  }
}
export default Page;