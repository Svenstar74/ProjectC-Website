import axios from 'axios';

import { AggregatedNodeModel } from '@svenstar74/business-logic';

console.log(process.env.REACT_APP_API_BASE_URL)
console.log(process.env.NODE_ENV)
const baseUrl = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8000';

const apiCall = async (
  method: string,
  endpoint: string,
  headers: { [k: string]: string },
  data?: any
) => {
  if (data) {
    return await axios.request({
      method,
      url: baseUrl + endpoint,
      headers,
      data,
    });
  } else {
    return await axios.request({
      method,
      url: baseUrl + endpoint,
      headers,
    });
  }
};

export class ApiClient {
  headers = { 'Content-Type': 'application/json ' };

  async getAllNodes(): Promise<{ id: string; x: number; y: number; climateConceptId: string }[]> {
    const result = await apiCall('GET', '/api/v1/nodes', this.headers);
    return result.data.data;
  }

  async getAllNodesAggregated(): Promise<AggregatedNodeModel[]> {
    const result = await apiCall(
      'GET',
      '/api/v1/nodes/aggregated',
      this.headers
    );

    return result.data.data;
  }
}
