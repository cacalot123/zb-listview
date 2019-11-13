import Taro from "@tarojs/taro-h5";
function get(key, defaultValue) {
  let value = Taro.getStorageSync(key);
  if (!value || value === ' ' || value === 'undefined' || value === 'null') {
    value = '';
  }
  return value ? JSON.parse(value) : defaultValue;
}
function set(key, value) {
  Taro.setStorageSync(key, JSON.stringify(value));
}
function remove(key) {
  Taro.removeStorageSync(key);
}
function clear() {
  Taro.clearStorageSync();
}
export default {
  get,
  set,
  remove,
  clear
};