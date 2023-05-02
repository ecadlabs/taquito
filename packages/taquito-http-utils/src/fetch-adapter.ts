/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosRequestConfig, AxiosResponse } from 'axios';

const settle = require('axios/lib/core/settle');
const buildURL = require('axios/lib/helpers/buildURL');
const buildFullPath = require('axios/lib/core/buildFullPath');
const { isUndefined, isStandardBrowserEnv, isFormData } = require('axios/lib/utils');

/**
 * - Create a request object
 * - Get response body
 * - Check if timeout
 */
export default async function fetchAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const request = createRequest(config);
    const promiseChain = [getResponse(request, config)];

    if (config.timeout && config.timeout > 0) {
        promiseChain.push(
            new Promise((res) => {
                setTimeout(() => {
                    const message = config.timeoutErrorMessage
                        ? config.timeoutErrorMessage
                        : 'timeout of ' + config.timeout + 'ms exceeded';
                    res(createError(message, config, 'ECONNABORTED', request));
                }, config.timeout);
            })
        );
    }

    const data = await Promise.race(promiseChain);
    return new Promise((resolve, reject) => {
        if (data instanceof Error) {
            reject(data);
        } else {
            const c: any = config;
            ('settle' in c) && Object.prototype.toString.call(c.settle) === '[object Function]'
                ? c.settle(resolve, reject, data)
                : settle(resolve, reject, data);
        }
    });
}

/**
 * Fetch API stage two is to get response body. This function tries to retrieve
 * response body based on response's type
 */
async function getResponse(request: RequestInfo | URL, config: AxiosRequestConfig) {
    try {
        const stageOne = await fetch(request as any);
        
        let response: {
            ok: boolean;
            status: number;
            statusText: string;
            headers: Headers;
            config: AxiosRequestConfig;
            request: RequestInfo | URL;
            data?: unknown;
        } = {
            ok: stageOne.ok,
            status: stageOne.status,
            statusText: stageOne.statusText,
            headers: new Headers(stageOne.headers), // Make a copy of headers
            config: config,
            request,
          }
        if (stageOne.status >= 400) {
          return createError('Response Error', config, 'ERR_NETWORK', request, response);
        }

        response ={
            ok: stageOne.ok,
            status: stageOne.status,
            statusText: stageOne.statusText,
            headers: new Headers(stageOne.headers), // Make a copy of headers
            config: config,
            request,
        };
    
        if (stageOne.status >= 200 && stageOne.status !== 204) {
            switch (config.responseType) {
                case 'arraybuffer':
                    response.data = await stageOne.arrayBuffer();
                    break;
                case 'blob':
                    response.data = await stageOne.blob();
                    break;
                case 'json':
                    response.data = await stageOne.json();
                    break;
                // TODO: the next option does not exist in response type
                // case 'formData':
                //     response.data = await stageOne.formData();
                //     break;
                default:
                    response.data = await stageOne.text();
                    break;
            }
        }
    
        return response;
    } catch (e) {
        return createError('Network Error', config, 'ERR_NETWORK', request);
    }
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config: AxiosRequestConfig) {
    const headers = new Headers(config.headers as any);

    // HTTP basic authentication
    if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : '';
        headers.set('Authorization', `Basic ${btoa(username + ':' + password)}`);
    }

    const method = config.method?.toUpperCase();
    const options: RequestInit = {
        headers: headers,
        method,
    };
    if (method !== 'GET' && method !== 'HEAD') {
        options.body = config.data;

        // In these cases the browser will automatically set the correct Content-Type,
        // but only if that header hasn't been set yet. So that's why we're deleting it.
        if (isFormData(options.body) && isStandardBrowserEnv()) {
            headers.delete('Content-Type');
        }
    }
    const c = config as any;
    if ('mode' in c) {
        options.mode = c.mode as RequestMode;
    }
    if ('cache' in c) {
        options.cache = c.cache as RequestCache;
    }
    if ('integrity' in c) {
        options.integrity = c.integrity as string;
    }
    if ('redirect' in c) {
        options.redirect = c.redirect as RequestRedirect;
    }
    if ('referrer' in c) {
        options.referrer = c.referrer as string;
    }
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!isUndefined(c.withCredentials)) {
        options.credentials = c.withCredentials ? 'include' : 'omit';
    }

    const fullPath = buildFullPath(c.baseURL, c.url);
    const url = buildURL(fullPath, c.params, c.paramsSerializer);

    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}



/**
 * Note:
 * 
 *   From version >= 0.27.0, createError function is replaced by AxiosError class.
 *   So I copy the old createError function here for backward compatible.
 * 
 * 
 * 
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function createError(message: string, config: AxiosRequestConfig, code?: string, request?: RequestInfo | URL, response?: object) {
    // TODO: this code never runs
    // if ('AxiosError' in axios && axios.AxiosError && typeof axios.AxiosError === 'function' && isConstructor(axios.AxiosError)) {
    //     return new axios.AxiosError(message, axios.AxiosError[code], config, request, response);
    // }

    const error = new Error(message);
    return enhanceError(error, config, code, request, response);
}

/**
 * 
 * Note:
 * 
 *   This function is for backward compatible.
 * 
 *  
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
function enhanceError(error: any, config: AxiosRequestConfig, code?: string, request?: RequestInfo | URL, response?: object) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: 'description' in this ? this.description : undefined,
      number: 'number' in this ?this.number : undefined,
      // Mozilla
      fileName: 'fileName' in this ?this.fileName : undefined,
      lineNumber: 'lineNumber' in this ?this.lineNumber : undefined,
      columnNumber: 'columnNumber' in this ?this.columnNumber : undefined,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
}
