import { AxiosRequestConfig, AxiosResponse, IAxios, Method, RejectedFn, ResolvedFn } from '../type';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => Promise<AxiosResponse>);
  rejected?: RejectedFn;
}

export default class Axios implements IAxios {
  interceptor: Interceptors;

  constructor() {
    this.interceptor = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    };
  }

  request(url: any, config?: any): Promise<AxiosResponse> {
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      // url 为 config
      config = url;
    }

    const chain: PromiseChain<any>[] = [{
      resolved: dispatchRequest,
      rejected: undefined,
    }];

    /**
     * 拦截器放入调用队列
     * 请求拦截器 => 网络请求 => 响应拦截器
     */
    this.interceptor.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });

    this.interceptor.response.forEach((interceptor) => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      // await最后一个promise完成
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url,
    } as AxiosRequestConfig));
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(Object.assign(config || {}, {
      method,
      url,
      data,
    } as AxiosRequestConfig));
  }

  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithoutData('delete', url, config);
  }

  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithoutData('get', url, config);
  }

  head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithoutData('head', url, config);
  }

  options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithoutData('options', url, config);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithData('patch', url, data, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithData('post', url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this._requestMethodWithData('put', url, data, config);
  }
}
