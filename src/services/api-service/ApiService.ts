import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';

import { IApiRequest } from './IApiRequest';
import { IApiResponse } from './IApiResponse';

class ApiService {
  private _axiosInstance: AxiosInstance;

  constructor() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('Missing environment variable VITE_API_BASE_URL.');
    }

    this._axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  private async _request<T>(method: Method, config: IApiRequest): Promise<IApiResponse<T>> {
    try {
      // Make the request
      const response = await this._axiosInstance.request<AxiosResponse<T>>({
        method,
        url: config.endpoint,
        data: config.data,
        headers: config.headers,
      });

      // Extract headers
      const headers: { [key: string]: string } = {};
      for (const header in response.headers) {
        headers[header] = response.headers[header];
      }

      // Return the standardized response
      return {
        status: response.status,
        message: response.statusText,
        data: response.data.data,
        headers,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        // Throw a standardized error
        throw {
          status: error.response?.status || 500,
          message: error.response?.data.message || 'Unknown error',
          data: error.response?.data,
        };
      } else {
        throw {
          status: 500,
          message: 'Unknown error occurred',
          data: error,
        };
      }
    }
  }

  public async get<T>(config: IApiRequest): Promise<IApiResponse<T>> {
    return this._request<T>('GET', config);
  }

  public async post<T>(config: IApiRequest): Promise<IApiResponse<T>> {
    return this._request<T>('POST', config);
  }

  public async put<T>(config: IApiRequest): Promise<IApiResponse<T>> {
    return this._request<T>('PUT', config);
  }

  public async delete<T>(config: IApiRequest): Promise<IApiResponse<T>> {
    return this._request<T>('DELETE', config);
  }
}

export const apiService = new ApiService();
