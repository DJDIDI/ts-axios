// 项目公共定义

export type Method =
  'HEAD' | 'head' |
  'OPTIONS' | 'options' |
  'GET' | 'get' |
  'POST' | 'post' |
  'PUT' | 'put' |
  'PATCH' | 'patch' |
  'DELETE' | 'delete'

export interface AxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}

