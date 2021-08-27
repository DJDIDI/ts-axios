import { AxiosRequestConfig } from './type';
import { AxiosResponse } from '../dist/types/types';
import { parseHeaders } from './helpers/headers';

export default function xhr(config: AxiosRequestConfig) {
  return new Promise<AxiosResponse>(((resolve, reject) => {
    const { data = null, url, method = 'GET', headers, responseType, timeout } = config;

    const xhr = new XMLHttpRequest();

    if (responseType) {
      xhr.responseType = responseType;
    }

    if (timeout) {
      xhr.timeout = timeout;
    }

    xhr.open(method.toUpperCase(), url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 0) {
        return;
      }
      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
      const responseData = responseType !== 'text' ? xhr.response : xhr.responseType;

      // json字符串自动转json对象
      const response: AxiosResponse = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr,
      };

      // 处理状态码
      function handleResponse(response: AxiosResponse): void {
        if (response.status >= 200 && response.status < 300) {
          resolve(response);
        } else {
          reject(new Error(`Request Failed with status code ${response.status}`));
        }
      }

      handleResponse(response);
    };

    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };

    xhr.ontimeout = function () {
      reject(new Error(`Timeout of ${timeout} ms exceeded`));
    };

    Object.keys(headers).forEach((name) => {
      xhr.setRequestHeader(name, headers[name]);
    });

    xhr.send(data);
  }));
}
