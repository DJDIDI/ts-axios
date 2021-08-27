import { AxiosRequestConfig, AxiosResponse } from './type';
import xhr from './xhr';
import { buildURL } from './helpers/url';
import { transformRequest, transformResponseData } from './helpers/data';
import { processHeaders } from './helpers/headers';

function axios(config: AxiosRequestConfig): Promise<AxiosResponse> {
  processConfig(config);
  return xhr(config).then(res => transformResponse(res));
}

/**
 * 预处理config
 * @param config
 */
function processConfig(config: AxiosRequestConfig) {
  config.headers = transformHeaders(config);
  config.url = transformURL(config);
  config.data = transformRequestData(config);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data);
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

function transformResponse(response: AxiosResponse) {
  response.data = transformResponseData(response.data);
  return response;
}

export default axios;
