import Nerv from "nervjs";
import { Component } from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import './index.scss';
class Page extends Component {
  render() {
    return <View className="loading-box" data-color="red">
                <View style="width:100%;height:100%" className="lds-rolling">
                    <View className="circle" style={{ borderColor: this.props.color }} />
                    
                </View>
            </View>;
  }
}
export default Page;