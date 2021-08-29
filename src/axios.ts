import { AxiosInstance } from './type';
import Axios from './core/Axios';
import { extend } from './helpers/util';

function createInstance(): AxiosInstance {
  const context = new Axios();
  // axios本身是一个 函数
  // axios.xxx 是函数上的属性
  const instance = Axios.prototype.request.bind(context);

  // 把Axios对象上的方法 挂载到axios()函数上
  extend(instance, context);

  return instance as AxiosInstance;
}

const axios = createInstance();

export default axios;
