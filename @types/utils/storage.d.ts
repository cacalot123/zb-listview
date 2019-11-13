declare function get<T = any>(key: string, defaultValue?: T): T;
declare function set<T = any>(key: string, value: T): void;
declare function remove(key: string): void;
declare function clear(): void;
declare const _default: {
    get: typeof get;
    set: typeof set;
    remove: typeof remove;
    clear: typeof clear;
};
export default _default;
