import { AxiosRequestConfig, AxiosResponse } from '../type';

export class AxiosError extends Error {
  message: string;
  config: AxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: AxiosResponse;

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse,
  ) {
    super(message);
    this.message = message;
    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;

    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse,
) {
  return new AxiosError(message, config, code, request, response);
}
