import { isPlainObject } from './util';

// blob arraybuffer formdata
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export function transformResponseData(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
      console.log('data变对象');
    } catch (e) {
      // do nothing
    }
  }
  return data;
}
