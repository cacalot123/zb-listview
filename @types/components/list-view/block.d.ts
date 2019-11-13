/// <reference types="react" />
import { Component } from '@tarojs/taro';
import './block.scss';
interface LazyItem {
    key: string;
    className: string;
    viewHeight: number;
}
interface State {
}
interface Props {
    className?: string;
    current: number;
}
declare class LazyImage extends Component<Props, State> {
    static options: {
        addGlobalClass: boolean;
    };
    static externalClasses: string[];
    lazyItem: LazyItem;
    state: {
        scrollCur: number[];
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    bindTextListener(): void;
    isLoad: (current: any) => boolean;
    render(): JSX.Element;
}
export default LazyImage;
