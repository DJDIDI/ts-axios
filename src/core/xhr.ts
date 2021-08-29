import { AxiosRequestConfig } from '../type';
import { AxiosResponse } from '../../dist/types/types';
import { parseHeaders } from '../helpers/headers';
import { AxiosError } from '../helpers/error';

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
          reject(new AxiosError(`Request Failed with status code ${response.status}`, config, null, xhr, response));
        }
      }

      handleResponse(response);
    };

    xhr.onerror = function () {
      reject(new AxiosError('Network Error', config, null, xhr));
    };

    xhr.ontimeout = function () {
      reject(new AxiosError('Timeout of ${timeout} ms exceeded', config, 'ECONNABORTED', xhr));
    };

    Object.keys(headers).forEach((name) => {
      xhr.setRequestHeader(name, headers[name]);
    });

    xhr.send(data);
  }));
}
