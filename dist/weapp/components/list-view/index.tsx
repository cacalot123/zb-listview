import Taro, {Component} from '@tarojs/taro';
import {ScrollView, View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';
import Skeleton from '../skeleton';
import Loading from '../loading';
import tools from './tool'
import ResultPage from '../result-page';
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
  onScrollToLower: (any) => void;
  onPullDownRefresh?: (any) => void;
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
  activate?: any,
  deactivate?: any,
  release?: any,
  tipFreedText?: any;
}

interface Launch {
  launchEmpty?: boolean;
  launchError?: boolean;
  launchFooterLoading?: boolean;
  launchFooterLoaded?: boolean;
}

const initialState = {
  canScrollY: true,
  touchScrollTop: 0,
  scrollTop: 0,
  startY: 0,
  downLoading: false,
  lowerLoading: false,
  needPullDown: true,
  isInit: false,
  blockStyle: {
    transform: 'translate3d(0,0,0)',
    transition: 'none',
  },
};

const initialProps = {
  lazy: false,
  distanceToRefresh: 50,
  damping: 150,
  isLoaded: true,
  isEmpty: false,
  emptyText: '',
  noMore: '暂无更多内容',
  footerLoadingText: '加载中',
  footerLoadedText: '暂无更多内容',
  scrollTop: 0,
  touchScrollTop: 0,
  onScrollToLower: () => {
  },
  className: '',
  onPullDownRefresh: null,
  hasMore: false,
  needInit: false,
  isError: false,
  launch: {},
  renderEmpty: null,
  renderError: null,
  indicator: {}
};

type State = Readonly<typeof initialState>

class ListView extends Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  lazyClassName = (() => {
    return typeof this.props.lazy === 'boolean' ? '.lazy-view': this.props.lazy;
  })();

  lazyKey = (
    () => {
      if (this.props.lazy) {
        return  tools.lazyScrollInit(this.lazyClassName)
      }
    }
  )();

  lazyViewHeight = 0;

  static options = {
    addGlobalClass: true,
  };

  static defaultProps = initialProps;

  scrollView = {};

  state = initialState;

  startY = 0;

  componentDidMount() {
    this.trBody(0);
    if (this.props.lazy) {
      Taro.createSelectorQuery().in(this.$scope)
        .select('.scroll-view')
        .boundingClientRect()
        .exec(res => {
          tools.updateScrollHeight(this.lazyKey, res[0].height)
          this.lazyViewHeight = res[0].height
        })
    }
    if (this.props.needInit) this.fetchInit();
  }

  componentWillUnmount(): void {
    tools.lazyScrollRemove()
  }

  touchEvent = (e: ITouchEvent) => {
    const {type, touches} = e;
    const {onPullDownRefresh, distanceToRefresh, damping} = this.props;
    if (!onPullDownRefresh) return;
    switch (type) {
      case 'touchstart': {
        this.setState({
          touchScrollTop: this.state.scrollTop,
          // startY: touches[0].clientY,
          needPullDown: true,
        });
        this.startY = touches[0].clientY;
        break;
      }
      case 'touchmove': {
        const {clientY} = touches[0];
        const {touchScrollTop} = this.state;
        const height = Math.floor((clientY - this.startY) / 5);
        // 拖动方向不符合的不处理
        if (height < 0 || touchScrollTop > 5) return;
        this.setState({canScrollY: false});

        e.preventDefault(); // 阻止默认的处理方式(阻止下拉滑动的效果)
        if (height > 0 && height < (damping || 0)) {
          if (height < (distanceToRefresh || 0)) {
            this.setState({needPullDown: true});
          } else {
            this.setState({needPullDown: false});
          }
          this.trBody(height)
        }
        break;
      }
      case 'touchend': {
        if (!this.state.needPullDown) {
          this.fetchInit();
        } else {
          this.resetLoad(0);
        }
        break;
      }
      case 'touchcancel': {
        if (!this.state.needPullDown) {
          this.fetchInit();
        } else {
          this.resetLoad(0);
        }
        break;
      }
      default: {
        // console.log('foo');
      }
    }
  };

  fetchInit = () => {
    const {onPullDownRefresh} = this.props;
    this.resetLoad(1);
    if (onPullDownRefresh) {
      onPullDownRefresh(() => {
        this.setState({isInit: true});
        this.resetLoad(0, () => {
          this.setState({isInit: false});
        });
      });
    }
  };

  resetLoad = (status = 0, cb?) => {
    // status: 0:回复初始值 1：加载中
    const {distanceToRefresh} = this.props;
    let blockStyle = {
      transform: `translate3d(0,0,0)`,
      transition: 'all 300ms linear',
    };
    let state = {};
    switch (status) {
      case 0:
        state = {
          canScrollY:true,
          needPullDown: true,
          downLoading: false,
        };
        break;
      case 1:
        state = {
          canScrollY:false,
          needPullDown: false,
          downLoading: true,
        };
        blockStyle = {
          transform: `translate3d(0,${distanceToRefresh}px,0)`,
          transition: 'all 300ms linear',
        };
        break;
      default:
    }
    state = Object.assign({}, state,{ blockStyle });
    this.setState(JSON.parse(JSON.stringify(state)));
    // todo 监听真正动画结束
    setTimeout(function () {
      if (cb) cb();
    }, 400);
  };

  handleScrollToLower = () => {
    tools.debounce(() => {
      this.getMore();
    })();
  };

  getMore = () => {
    const {onScrollToLower, hasMore} = this.props;
    const {lowerLoading} = this.state;
    if (hasMore && !lowerLoading && onScrollToLower) {
      this.setState({lowerLoading: true});
      console.log('onScrollToLower')
      onScrollToLower(() => {
        this.setState({lowerLoading: false});
      });
    }
  };

  onScroll = e => {
    const {
      detail: {scrollTop},
    } = e;
    if (this.props.onScroll) this.props.onScroll()
    this.setState({scrollTop });
    if (this.props.lazy) {
      tools.lazyScroll(this.lazyKey,this.lazyClassName, this.lazyViewHeight )
    }
  };

  trBody = (y: number) => {
    this.setState({
      blockStyle: {
        transform: `translate3d(0,${y}px,0)`,
        transition: 'none linear',
      },
    });
  };

  render() {
    const {
      style,
      tipFreedText,
      tipText,
      hasMore,
      noMore,
      isEmpty,
      emptyText,
      className,
      isError,
      isLoaded,
      selector,
      launch,
      indicator,
      footerLoadingText,
      footerLoadedText,
      damping,
      circleColor,
      onPullDownRefresh,
    } = this.props;
    const {launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false} = launch as Launch;
    const {activate = '下拉刷新', deactivate = '释放刷新'} = indicator as Indicator;
    const {canScrollY, isInit, blockStyle, needPullDown, downLoading} = this.state;

    const showTipText = !downLoading && needPullDown && !isInit; // 下拉文案
    const showTipFreedText = !downLoading && !needPullDown && !isInit;// 释放文案

    const showChildren = !(isEmpty || isError); // 展示children内容

    const showFooter = !downLoading && !isEmpty && !isError; // 空、错状态不展示底部
    const footerLoaded = showFooter && !launchFooterLoaded && !hasMore;
    const customFooterLoaded = showFooter && launchFooterLoaded && !hasMore; // 渲染renderLoadedText
    const footerLoading = showFooter && !launchFooterLoading && hasMore;
    const customFooterLoading = showFooter && launchFooterLoading && hasMore; // 渲染renderNoMore

    const newStyle = {
      ...style,
      overflowY: canScrollY ? 'scroll' : 'hidden',
    };
    const trStyle = {
      ...blockStyle
    };
    //taro scrollView 组建scrollY无效
    return (
      <Skeleton isLoaded={isLoaded || isError} selector={selector}>
        <ScrollView
          ref={node => {
            this.scrollView = node;
          }}
          className={`${className} scroll-view`}
          style={newStyle}
          scrollY={canScrollY}
          lowerThreshold={0}
          onScrollToLower={this.handleScrollToLower}
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <View
            style={{ minHeight: '100%', overflowY: 'hidden' }}
            onTouchMove={(e) => this.touchEvent(e)}
            onTouchEnd={(e) => this.touchEvent(e)}
            onTouchStart={(e) => this.touchEvent(e)}
            onTouchCancel={(e) => this.touchEvent(e)}
          >
            <View
              style={trStyle}
              className='bodyView'
            >
              <View style={{ height: `${damping}px`, marginTop: `-${damping}px` }} className={`pullDownBlock ${onPullDownRefresh?'':'unNeedBlock'}`}>
                <View className='tip'>
                  {showTipFreedText && <View>{deactivate || tipFreedText}</View>}
                  {showTipText && <View>{activate || tipText}</View>}
                  {/*{downLoading && <View>{release}</View>}*/}
                  {downLoading && <Loading color={circleColor} />}
                </View>
              </View>
              {/* present children */}
              {showChildren && this.props.children}
              <ResultPage
                renderError={this.props.renderError}
                renderEmpty={this.props.renderEmpty}
                launchError={launchError}
                launchEmpty={launchEmpty}
                isError={isError || false}
                isEmpty={isEmpty || false}
                emptyText={emptyText || ''}
                fetchInit={this.fetchInit}
              />
              {/* default page */}
              {
                footerLoading && (
                  <View className='loading'>
                    {footerLoadingText}
                  </View>
                )
              }
              {/* custom footer loading page*/}
              {
                customFooterLoading && this.props.renderFooterLoading
              }
              {/* default footer loaded page*/}
              {
                footerLoaded && (
                  <View className='loaded'>
                    {noMore || footerLoadedText}
                  </View>
                )
              }
              {/* custom footer loaded page*/}
              {
                customFooterLoaded && this.props.renderFooterLoaded
              }
            </View>
          </View>
        </ScrollView>
      </Skeleton>
    );
  }
}

export default ListView;
