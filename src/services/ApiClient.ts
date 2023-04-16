import axios from 'axios';
import { ClimateConceptNodesRepository, ClimateConceptsRepository, SummaryNodesRepository } from '@svenstar74/business-logic';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

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

  //#region Climate Concepts
  async getAllClimateConcepts(): Promise<ClimateConceptsRepository.ClimateConceptModel> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept/',
      this.headers,
    );

    return response.data.data;
  }
  
  async getClimateConcept(id: string): Promise<ClimateConceptsRepository.ClimateConceptModel> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept/' + id,
      this.headers,
    );

    return response.data.data;
  }

  async addSource(climateConceptId: string, url: string, originalText: string): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/climate-concept/source/' + climateConceptId,
      this.headers,
      { url, originalText },
    );

    return response.status;
  }

  async deleteSource(climateConceptId: string, url: string, originalText: string): Promise<number> {
    const response = await apiCall(
      'DELETE',
      '/api/v1/climate-concept/source/' + climateConceptId,
      this.headers,
      { url, originalText },
    );

    return response.status;
  }

  async getAllStringRepresentations(): Promise<string[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept/string-representation/all',
      this.headers,
    );

    return response.data.data;
  }

  async updateStringRepresentation(climateConceptId: string, stringRepresentation: string): Promise<number> {
    const response = await apiCall(
      'PUT',
      '/api/v1/climate-concept/string-representation/' + climateConceptId,
      this.headers,
      { stringRepresentation },
    );

    return response.status;
  }
  //#endregion

  //#region Climate Concept Nodes
  async getAllClimateConceptNodes(): Promise<ClimateConceptNodesRepository.ClimateConceptNodeModel[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept-node/',
      this.headers,
    );

    return response.data.data;
  }
  
  async getClimateConceptNode(climateConceptId: string): Promise<ClimateConceptNodesRepository.AggregatedClimateConceptNodeModel | null> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept-node/' + climateConceptId,
      this.headers
    );

    return response.data.data;
  }

  async getAllClimateConceptNodesAggregated(): Promise<ClimateConceptNodesRepository.AggregatedClimateConceptNodeModel[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/climate-concept-node/aggregated/all',
      this.headers
    );

    return response.data.data;
  }

  async addClimateConceptNode(
    stringRepresentation: string,
    x: number,
    y: number
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      '/api/v1/climate-concept-node/',
      this.headers,
      { stringRepresentation, x, y }
    );

    return response.status;
  }

  async deleteClimateConceptNode(climateConceptId: string): Promise<number> {
    const response = await apiCall(
      'DELETE',
      '/api/v1/climate-concept-node/' + climateConceptId,
      this.headers,
    );

    return response.status;
  }

  async addEdge(
    sourceClimateConceptId: string,
    stringRepresentation: string
  ): Promise<number> {
    const response = await apiCall(
      'POST',
      `/api/v1/climate-concept-node/${sourceClimateConceptId}/edge/`,
      this.headers,
      { sourceClimateConceptId, stringRepresentation }
    );

    return response.status;
  }

  async deleteEdge(
    sourceClimateConceptId: string,
    targetClimateConceptId: string
  ): Promise<number> {
    const response = await apiCall(
      'DELETE',
      `/api/v1/climate-concept-node/${sourceClimateConceptId}/edge/`,
      this.headers,
      { sourceClimateConceptId, targetClimateConceptId }
    );

    return response.status;
  }

  async updateClimateConceptNodePosition(
    climateConceptId: string,
    x: number,
    y: number
  ): Promise<number> {
    const response = await apiCall(
      'PUT',
      '/api/v1/climate-concept-node/position/' + climateConceptId,
      this.headers,
      { x, y }
    );

    return response.status;
  }

  async updateClimateConceptNodeLabel(
    climateConceptId: string,
    label: 'NeedsReview' | 'NeedsCorrection',
    value: boolean
  ) {
    const response = await apiCall(
      'PUT',
      '/api/v1/climate-concept-node/label/' + climateConceptId,
      this.headers,
      { label, value }
    );

    return response.status;
  }
  //#endregion

  //#region Summary Nodes
  async getAllSummaryNodes(): Promise<SummaryNodesRepository.SummaryNodeModel[]> {
    const response = await apiCall(
      'GET',
      '/api/v1/summary-node/',
      this.headers,
    );

    return response.data.data;
  }
  
  async getSummaryNode(id: string): Promise<SummaryNodesRepository.SummaryNodeModel> {
    const response = await apiCall(
      'GET',
      '/api/v1/summary-node/' + id,
      this.headers,
    );

    return response.data.data;
  }

  async addSummaryNode(combinedNodes: string[], x: number, y: number): Promise<void> {
    await apiCall(
      'POST',
      '/api/v1/summary-node/',
      this.headers,
      { combinedNodes, x, y },
    );
  }

  async deleteSummaryNode(id: string): Promise<void> {
    await apiCall(
      'DELETE',
      '/api/v1/summary-node/' + id,
      this.headers,
    );
  }

  async addConceptsToSummaryNode(id: string, climateConceptIds: string[]): Promise<void>{
    await apiCall(
      'PUT',
      '/api/v1/summary-node/combined-nodes/' + id,
      this.headers,
      { newNodes: climateConceptIds },
    );
  }

  async removeConceptsFromSummaryNode(id: string, climateConceptIds: string[]): Promise<void> {
    await apiCall(
      'DELETE',
      '/api/v1/summary-node/combined-nodes/' + id,
      this.headers,
      { nodesToRemove: climateConceptIds}
    );
  }

  async renameSummaryNode(id: string, newName: string): Promise<void> {
    await apiCall(
      'PUT',
      '/api/v1/summary-node/name/' + id,
      this.headers,
      { newName },
    );
  }

  async repositionSummaryNode(id: string, newX: number, newY: number): Promise<void> {
    await apiCall(
      'PUT',
      '/api/v1/summary-node/position/' + id,
      this.headers,
      { newX, newY },
    );
  }
  //#endregion
}
