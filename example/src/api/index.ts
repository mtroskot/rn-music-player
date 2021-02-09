import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { IApiRequest } from 'src/interfaces';

const CancelToken = axios.CancelToken;

const defaultOptions: AxiosRequestConfig = {
  headers: {
    Accept: 'application/json',
  },
  validateStatus(status: number) {
    return [200, 201].includes(status); // Accept only status code 2xx or 401 if token expired
  },
  timeout: 5000,
};

/**
 * Calls api and returns response data if status OK.
 * setTimeout needed for android to cancel request, if you don't have internet connection or the IP address or
 * domain name that you're requesting not there,in this case axios timeout will not work.
 * @param {string} url The api endpoint.
 * @param {object} options The request options.
 * @returns {Promise<AxiosResponse<any>>}
 */
async function callApi<T>({ url, options }: IApiRequest): Promise<AxiosResponse<T>> {
  let source = CancelToken.source();
  // Android ignores timeout, setTimeout is used for canceling the request
  setTimeout(() => {
    source.cancel();
  }, 6000);
  let fetchOptions: AxiosRequestConfig = { ...defaultOptions, cancelToken: source.token, ...options };
  return axios(url, fetchOptions);
}

export default { callApi };
