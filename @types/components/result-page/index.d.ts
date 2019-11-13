/// <reference types="react" />
import { Component } from '@tarojs/taro';
import './index.scss';
interface PagePros {
    renderError?: JSX.Element;
    renderEmpty?: JSX.Element;
    isError: boolean;
    launchError: boolean;
    isEmpty: boolean;
    launchEmpty: boolean;
    emptyText: string;
    fetchInit: () => void;
}
declare class Page extends Component<PagePros> {
    render(): JSX.Element;
}
export default Page;
