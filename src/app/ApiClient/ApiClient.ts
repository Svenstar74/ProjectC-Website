import axios from 'axios';

import { AggregatedNodeModel, ClimateConceptModel } from '@svenstar74/business-logic';

const baseUrl = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8000';
console.log(baseUrl);

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
  headers: {[k: string]: string} = { 'Content-Type': 'application/json ' };

  constructor(user: string) {
    this.headers['Websocket-User'] = user;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  
  async getClimateConcept(id: string): Promise<ClimateConceptModel> {
    const result = await apiCall('GET', '/api/v1/climate-concepts/' + id, this.headers);
    return result.data.data;
  }
  
  async getAllNodes(): Promise<{ id: string; x: number; y: number; climateConceptId: string }[]> {
    const result = await apiCall('GET', '/api/v1/nodes', this.headers);
    return result.data.data;
  }

  async getAllNodesAggregated(): Promise<AggregatedNodeModel[]> {
    const result = await apiCall(
      'GET',
      '/api/v1/nodes/all/aggregated',
      this.headers
    );

    return result.data.data;
  }

  async addNode(stringRepresentation: string, x: number, y: number): Promise<number> {
    const result = await apiCall(
      'POST',
      '/api/v1/nodes/add-node',
      this.headers,
      { stringRepresentation, x, y }
    )

    return result.status;
  }

  async deleteNode(climateConceptId: string): Promise<number> {
    const result = await apiCall(
      'DELETE',
      '/api/v1/nodes/delete-node',
      this.headers,
      { climateConceptId }
    )

    return result.status;
  }
  
  async addEdge(sourceClimateConceptId: string, stringRepresentation: string): Promise<void> {
    await apiCall(
      'POST',
      '/api/v1/nodes/add-edge',
      this.headers,
      { sourceClimateConceptId, stringRepresentation }
    );
  }

  async deleteEdge(sourceClimateConceptId: string, targetClimateConceptId: string) {
    await apiCall(
      'DELETE',
      '/api/v1/nodes/delete-edge',
      this.headers,
      { sourceClimateConceptId, targetClimateConceptId }
    )
  }
  
  async updateNodePosition(nodeId: string, x: number, y: number): Promise<void> {
    const result = await apiCall(
      'POST',
      '/api/v1/nodes/update-position',
      this.headers,
      { nodeId, x, y }
    );

    return result.data;
  }

  async updateNodeString(climateConceptId: string, stringRepresentation: string): Promise<void> {
    const result = await apiCall(
      'POST',
      '/api/v1/nodes/update-string',
      this.headers,
      { climateConceptId, stringRepresentation }
    )

    return result.data;
  }

  async getListOfStringRepresentations(): Promise<string[]> {
    const result = await apiCall(
      'GET',
      '/api/v1/climate-concepts/all/string-representations',
      this.headers
    );

    return result.data.data;
  }
}
