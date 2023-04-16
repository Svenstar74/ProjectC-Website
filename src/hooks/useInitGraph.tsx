import { useContext, useEffect } from "react";
import useApiClient from "./useApiClient";
import { AppContext } from "../store/context/AppContext";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { initAllClimateConceptNodes, initAllSummaryNodes } from "../store/redux/slices/dataSlice";

function useInitGraph() {
  const apiClient = useApiClient();
  const { globalSigmaInstance } = useContext(AppContext);
  const dispatch = useAppDispatch();

  const allClimateConceptNodes = useAppSelector(state => state.data.allClimateConceptNodes);
  const allSummaryNodes = useAppSelector(state => state.data.allSummaryNodes);

  useEffect(() => {
    async function loadAllNodes() {
      // Only initialize if sigma is ready and if one of the arrays is not yet initialized
      if (globalSigmaInstance && (allClimateConceptNodes.length === 0 || allSummaryNodes.length === 0)) {
        console.log("CARE! NEW SIGMA INSTANCE!")

        //#region Initialize all climate concept nodes.
        // 1. Add them to the redux store
        // 2. Create a node for each one in the sigma instance
        // 3. Create the edges
        const allFetchedClimateConceptNodes = await apiClient.getAllClimateConceptNodesAggregated();
        
        dispatch(initAllClimateConceptNodes(allFetchedClimateConceptNodes));
        allFetchedClimateConceptNodes.forEach(node => {
          // Add the node
          let color = '#999';
          if (node.needsReview) {
            color = '#008bff';
          }

          if (node.needsCorrection) {
            color = '#f00';
          }

          globalSigmaInstance?.getGraph().addNode(node.climateConcept.id,
            {
              label: node.climateConcept.stringRepresentation,
              x: node.x, y: node.y, size: node.size, color,
              forceLabel: true, hidden: false,
            });
          
          // Add the edges
          node.climateConcept.incomingConnections.forEach(
            (connection: string) => {
              try {
                globalSigmaInstance?.getGraph().addEdge(connection, node.climateConcept.id, { size: 2});
              } catch {}
            }
          );
  
          node.climateConcept.outgoingConnections.forEach(
            (connection: string) => {
              try {
                globalSigmaInstance?.getGraph().addEdge(node.climateConcept.id, connection, { size: 2 });
              } catch {}
            }
          );
        })
        //#endregion

        //#region Initialize all summary nodes.
        // 1. Add them to the redux store
        // 2. Create a node for each one in the sigma instance
        // 3. Create the edges
        // 4. Hide the climate concept nodes that are within the summary node
        const allFetchedSummaryNodes = await apiClient.getAllSummaryNodes();

        dispatch(initAllSummaryNodes(allFetchedSummaryNodes));
        allFetchedSummaryNodes.forEach(node => {
          globalSigmaInstance.getGraph().addNode(node.id,
            {
              label: node.name,
              x: node.x, y: node.y, size: node.size,
              hidden: false,
            });

          const incomingNodes: string[] = [];
          const outgoingNodes: string[] = [];
          node.combinedNodes.forEach(id => {            
            globalSigmaInstance.getGraph().forEachInNeighbor(id, (neighbor: string) => incomingNodes.push(neighbor));
            globalSigmaInstance.getGraph().forEachOutNeighbor(id, (neighbor: string) => outgoingNodes.push(neighbor));
                        
            globalSigmaInstance.getGraph().setNodeAttribute(id, 'hidden', true);
          });

          // Add the connections
          try {
            incomingNodes.forEach(id => {
              globalSigmaInstance?.getGraph().addEdge(id, node.id, { size: 2 });
            });
          } catch {}
          try {
            outgoingNodes.forEach(id => {
              globalSigmaInstance?.getGraph().addEdge(node.id, id, { size: 2 });
            });
          } catch {}

        })
        //#endregion
      }
    }

    loadAllNodes();
  }, [globalSigmaInstance]);
}

export default useInitGraph;
