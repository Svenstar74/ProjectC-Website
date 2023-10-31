export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
  headers: { [key: string]: string };
}
