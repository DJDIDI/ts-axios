import { isDate, isPlainObject } from './util';

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/ig, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/ig, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/ig, '[')
    .replace(/%5D/ig, ']');
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url;

  // 'key=val'[]
  const parts: string[] = [];

  Object.keys(params).forEach((key) => {
    const val = params[key];
    // null 或 undefined 不放入请求参数
    if (val === null || typeof val === 'undefined') {
      return;
    }
    // 数组情况 同质化
    let values = [];
    if (Array.isArray(val)) {
      values = val;
      key += '[]';
    } else {
      values = [val];
    }
    // 拼接 key=val
    // 日期、对象特殊处理
    // utf-8 => ascii
    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString();
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val);
      }
      parts.push(`${encode(key)}=${encode(val)}`);
    });
  });

  const serializedParams = parts.join('&');

  if (serializedParams) {
    // 截 # hash之后
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex);
    }

    // url拼接参数
    if (url.includes('?')) {
      url += `&${serializedParams}`;
    } else {
      url += `?${serializedParams}`;
    }
  }
  return url;
}
