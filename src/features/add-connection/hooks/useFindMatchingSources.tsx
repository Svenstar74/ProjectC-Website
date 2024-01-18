import useApiClient from "../../../components/hooks/useApiClient";

function useFindMatchingSources() {
  const apiClient = useApiClient();

  /**
   * Verify that the source and target node have an identical source.
   * @param sourceNodeId 
   * @param targetNodeId 
   */
  async function findMatchingSources(sourceNodeId: string, targetNodeId: string) {
    const sourceNode = await apiClient.getClimateConceptNode(sourceNodeId);
    const targetNode = await apiClient.getClimateConceptNode(targetNodeId);

    const sourceNodeSources = sourceNode?.sources ?? [];
    const targetNodeSources = targetNode?.sources ?? [];

    // Sources have a url and originalText prop that have to match
    const intersection = sourceNodeSources.filter((source) => {
      return targetNodeSources.some((target) => {
        return source.url === target.url && source.originalText === target.originalText;
      });
    });

    return intersection;
  }

  return {
    findMatchingSources,
  };
}

export default useFindMatchingSources;
