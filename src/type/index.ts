import InterceptorManager from '../core/InterceptorManager';

export type Method =
  'HEAD' |
  'head' |
  'OPTIONS' |
  'options' |
  'GET' |
  'get' |
  'POST' |
  'post' |
  'PUT' |
  'put' |
  'PATCH' |
  'patch' |
  'DELETE' |
  'delete'

export interface AxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: AxiosResponse;
}

export interface IAxios {
  interceptor: {
    request: InterceptorManager<AxiosRequestConfig>;
    response: InterceptorManager<AxiosResponse>;
  };

  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  head(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  options(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;

  patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
}

export interface AxiosInstance extends IAxios {
  (config: AxiosRequestConfig): Promise<AxiosResponse>;

  (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>;
}

export interface RejectedFn {
  (error: any): any;
}

