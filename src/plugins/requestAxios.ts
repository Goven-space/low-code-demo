import * as api from '../api';
import { RuntimeOptionsConfig } from '@alilc/lowcode-datasource-types';
import { RequestOptions, AsObject } from 'universal-request/lib/types';
import { getUrlSearch } from "../tool";


export function createAxiosFetchHandler(config?: Record<string, unknown>) {
  return async function(options: RuntimeOptionsConfig) {
    const opts: RequestOptions = {
      ...options,
      url: options.uri,
      method: options.method as RequestOptions['method'],
      data: options.params as AsObject,
      headers: {
        ...options.headers,
        identitytoken: localStorage.getItem('identitytoken')
      } as AsObject,
      ...config,
    };
    const response = await api[options.method](opts.url, opts.data, {headers: opts.headers},options.appType)
    return response;
  };
}