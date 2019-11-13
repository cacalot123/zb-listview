/// <reference types="react" />
import { Component } from '@tarojs/taro';
import './index.scss';
interface PagePros {
    color?: any;
}
declare class Page extends Component<PagePros> {
    render(): JSX.Element;
}
export default Page;
