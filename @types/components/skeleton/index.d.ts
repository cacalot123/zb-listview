/// <reference types="react" />
import { Component } from '@tarojs/taro';
import './index.scss';
interface Props {
    isLoaded: boolean;
    selector?: string;
}
interface Item {
    width: string | number;
    height: string | number;
    top: string | number;
    left: string | number;
}
interface State {
    parentRect: Record<any, string>;
    bg: Item[];
    list: Item[];
    listRadius: Item[];
}
declare class Skeleton extends Component<Props, State> {
    static defaultProps: {
        isLoaded: boolean;
        selector: string;
    };
    state: {
        parentRect: {};
        bg: never[];
        list: never[];
        listRadius: never[];
    };
    componentDidMount(): void;
    h5Skl(): void;
    weappSkl(): void;
    render(): JSX.Element;
}
export default Skeleton;
