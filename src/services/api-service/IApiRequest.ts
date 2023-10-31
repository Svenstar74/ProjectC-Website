export interface IApiRequest {
  endpoint: string;
  headers?: Record<string, string>;
  data?: any;
}
