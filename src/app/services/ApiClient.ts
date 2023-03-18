import axios from 'axios';
import { AggregatedNodeModel, ClimateConceptModel } from '@svenstar74/business-logic';

const baseUrl = process.env.REACT_APP_API_BASE_URL ?? '';

const apiCall = async (
  method: string,
  endpoint: string,
  headers: { [k: string]: string },
  data?: any
) => {
  return await axios.request({
    method,
    url: baseUrl + endpoint,
    headers,
    data,
  });
};

export class ApiClient {
  headers: { [k: string]: string } = { 'Content-Type': 'application/json ' };

  constructor(user: string) {
    this.headers['Websocket-User'] = user;
  }

  async getClimateConcept(id: string): Promise<ClimateConceptModel> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concepts/' + id,
      this.headers
    );
    return response.data.data;
  }

  async getAllNodesAggregated(): Promise<AggregatedNodeModel[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/nodes/all/aggregated',
      this.headers
    );

    return response.data.data;
  }

  async getListOfStringRepresentations(): Promise<string[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concepts/all/string-representations',
      this.headers
    );

    return response.data.data;
  }

  async addNode(
    stringRepresentation: string,
    x: number,
    y: number
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/nodes/add-node',
      this.headers,
      { stringRepresentation, x, y }
    );

    return response.status;
  }

  async addEdge(
    sourceClimateConceptId: string,
    stringRepresentation: string
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/nodes/add-edge',
      this.headers,
      { sourceClimateConceptId, stringRepresentation }
    );

    return response.status;
  }

  async updateNodePosition(
    nodeId: string,
    x: number,
    y: number
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/nodes/update-position',
      this.headers,
      { nodeId, x, y }
    );

    return response.status;
  }

  async updateNodeString(
    climateConceptId: string,
    stringRepresentation: string
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/nodes/update-string',
      this.headers,
      { climateConceptId, stringRepresentation }
    );

    return response.status;
  }

  async deleteNode(climateConceptId: string): Promise<number> {
    const response = await apiCall(
      'DELETE',
      '/api/v1/nodes/delete-node',
      this.headers,
      { climateConceptId }
    );

    return response.status;
  }

  async deleteEdge(
    sourceClimateConceptId: string,
    targetClimateConceptId: string
  ): Promise<number> {
    const response = await apiCall(
      'DELETE',
      '/api/v1/nodes/delete-edge',
      this.headers,
      { sourceClimateConceptId, targetClimateConceptId }
    );

    return response.status;
  }
}
