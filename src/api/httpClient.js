import axios from 'axios';
import { createErrorResult, createSuccessResult } from './ResultContainer';
import { NetworkError } from './NetworkError.js';
import { useToast } from 'vue-toastification';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus(status) {
    /*
      405 Method Not Allowed
      408 Request Timeout
      429 Too Many Requests
     */
    return ![408, 413, 429].includes(status) && status < 500;
  },
});

httpClient.interceptors.response.use(
  (response) => {
    if (response.status >= 400) {
      const errorMessage = response.data.message ?? response.data ?? response.statusText;
      useToast().error(errorMessage, { timeout: 5000 });
      return createErrorResult(
        {
          statusCode: response.status,
          message: errorMessage,
        },
        response,
      );
    } else {
      return createSuccessResult(response.data, response);
    }
  },
  (error) => {
    // useToast().error(error.message, { timeout: 5000 });
    if (!error.response || error.code === 'ECONNABORTED') {
      return Promise.reject(new NetworkError(error.request));
    } else {
      return Promise.reject(error);
    }
  },
);
