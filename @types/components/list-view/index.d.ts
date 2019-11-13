/// <reference types="react" />
import { Component } from '@tarojs/taro';
import { ITouchEvent } from '@tarojs/components/types/common';
import './index.scss';
interface Props {
    lazy?: boolean | string;
    circleColor?: string;
    style?: any;
    className?: string;
    emptyText?: string;
    footerLoadedText?: string;
    footerLoadingText?: string;
    noMore?: string;
    tipText?: string;
    tipFreedText?: string;
    onScrollToLower: (any: any) => void;
    onPullDownRefresh?: (any: any) => void;
    hasMore: boolean;
    needInit?: boolean;
    isEmpty?: boolean;
    isError?: boolean;
    launch?: Launch;
    renderEmpty?: JSX.Element;
    renderError?: JSX.Element;
    renderFooterLoading?: any;
    renderFooterLoaded?: any;
    damping?: number;
    distanceToRefresh?: number;
    indicator?: Indicator;
    isLoaded?: boolean;
    selector?: string;
    onScroll?: () => void;
}
interface Indicator {
    activate?: any;
    deactivate?: any;
    release?: any;
    tipFreedText?: any;
}
interface Launch {
    launchEmpty?: boolean;
    launchError?: boolean;
    launchFooterLoading?: boolean;
    launchFooterLoaded?: boolean;
}
declare const initialState: {
    canScrollY: boolean;
    touchScrollTop: number;
    scrollTop: number;
    startY: number;
    downLoading: boolean;
    lowerLoading: boolean;
    needPullDown: boolean;
    isInit: boolean;
    blockStyle: {
        transform: string;
        transition: string;
    };
};
declare type State = Readonly<typeof initialState>;
declare class ListView extends Component<Props, State> {
    lazyClassName: string | undefined;
    lazyKey: string | undefined;
    lazyViewHeight: number;
    static options: {
        addGlobalClass: boolean;
    };
    static defaultProps: {
        lazy: boolean;
        distanceToRefresh: number;
        damping: number;
        isLoaded: boolean;
        isEmpty: boolean;
        emptyText: string;
        noMore: string;
        footerLoadingText: string;
        footerLoadedText: string;
        scrollTop: number;
        touchScrollTop: number;
        onScrollToLower: () => void;
        className: string;
        onPullDownRefresh: null;
        hasMore: boolean;
        needInit: boolean;
        isError: boolean;
        launch: {};
        renderEmpty: null;
        renderError: null;
        indicator: {};
    };
    scrollView: {};
    state: {
        canScrollY: boolean;
        touchScrollTop: number;
        scrollTop: number;
        startY: number;
        downLoading: boolean;
        lowerLoading: boolean;
        needPullDown: boolean;
        isInit: boolean;
        blockStyle: {
            transform: string;
            transition: string;
        };
    };
    startY: number;
    componentDidMount(): void;
    componentWillUnmount(): void;
    touchEvent: (e: ITouchEvent) => void;
    fetchInit: () => void;
    resetLoad: (status?: number, cb?: any) => void;
    handleScrollToLower: () => void;
    getMore: () => void;
    onScroll: (e: any) => void;
    trBody: (y: number) => void;
    render(): JSX.Element;
}
export default ListView;
