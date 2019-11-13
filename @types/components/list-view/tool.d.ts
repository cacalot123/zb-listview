export declare function debounce(method: any, time?: number): () => void;
declare function lazyScrollInit(className: any): string;
declare function lazyScrollRemove(): void;
declare function updateScrollHeight(key: any, viewHeight: any): void;
declare function lazyScroll(key: any, selector: any, height: any): void;
declare const _default: {
    lazyScroll: typeof lazyScroll;
    wait: (time?: number) => Promise<unknown>;
    debounce: typeof debounce;
    updateScrollHeight: typeof updateScrollHeight;
    lazyScrollInit: typeof lazyScrollInit;
    lazyScrollRemove: typeof lazyScrollRemove;
};
export default _default;
