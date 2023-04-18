import { useContext, useEffect, useState } from "react";
import { AppContext } from "../store/context/AppContext";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { addClimateConceptEdge, addClimateConceptNode, addClimateConceptSource, addCombinedNode, deleteClimateConceptEdge, deleteClimateConceptNode, deleteClimateConceptSource, deleteSummaryNode, newSummaryNode, removeCombinedNode, updateClimateConceptLabel, updateClimateConceptNodeStringRepresentation, updateSummaryNodeName } from "../store/redux/slices/dataSlice";
import { setLastSelected } from "../store/redux/slices/graphSlice";
import { AggregatedClimateConceptNodeModel } from "@svenstar74/business-logic/build/src/repositories/ClimateConceptNodes.repository";
import useApiClient from "./useApiClient";
import { validate } from "uuid";
import { SummaryNodeModel } from "@svenstar74/business-logic/build/src/repositories/SummaryNodes.repository";

function useWebSocket() {
  const baseUrl = import.meta.env.VITE_WS_BASE_URL ?? '';
  const apiClient = useApiClient();

  const { globalSigmaInstance } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const summaryNodesVisible = useAppSelector((state) => state.tool.summaryNodesVisible);
  
  const allSummaryNodes = useAppSelector((state) => state.data.allSummaryNodes);

  function getCombinedNodesForSummaryNode(summaryNodeId: string) {
    const node = allSummaryNodes.find(node => node.id === summaryNodeId);
    if (!node) {
      return [];
    }

    return node.combinedNodes;
  }

  let ws: WebSocket;

  function connect() {
    // if (!ws) {
    //   ws = new WebSocket(baseUrl + user);
    // } else {
    //   ws.close();
    // }
    ws = new WebSocket(baseUrl + user);

    console.log('New Websocket with id ' + user);

    ws.onopen = () => { console.log('Websocket connection opened, ready for listening'); };
    ws.onclose = () => {
      console.log('Websocket connection closed, attempting to reconnect ...');
      setTimeout(() => connect(), 5000);
    };
    ws.onerror = () => { console.log('Websocket encountered an error'); };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.eventType) {
        //#region ClimateConcept Events
        case 'AddedSource':
          dispatch(addClimateConceptSource({
            id: data.climateConceptId,
            url: data.url,
            originalText: data.originalText,
          }));
          break;
        case 'DeletedSource':
          dispatch(deleteClimateConceptSource({
            id: data.climateConceptId,
            url: data.url,
            originalText: data.originalText,
          }));
          break;
        case 'UpdatedStringRepresentation':
          dispatch(updateClimateConceptNodeStringRepresentation({
            id: data.climateConceptId,
            newName: data.stringRepresentation,
          }));
          globalSigmaInstance?.getGraph().setNodeAttribute(
            data.climateConceptId, 'label', data.stringRepresentation,
          );
          break;
        //#endregion
        
        //#region ClimateConceptNode Events
        case 'AddedClimateConceptNode':
          dispatch(addClimateConceptNode({
            id: data.climateConceptId,
            stringRepresentation: data.stringRepresentation,
            x: data.x,
            y: data.y,
          }));
          globalSigmaInstance
            ?.getGraph()
            .addNode(data.climateConceptId, {
              x: data.x,
              y: data.y,
              label: data.stringRepresentation,
              forceLabel: true,
          });
          break;
        case 'DeletedClimateConceptNode':
          dispatch(setLastSelected({ lastSelected: null, data: '' }))
          dispatch(deleteClimateConceptNode(data.climateConceptId));
          globalSigmaInstance?.getGraph().dropNode(data.climateConceptId);
          break;

        case 'AddedClimateConceptEdge':
          dispatch(addClimateConceptEdge({ sourceId: data.sourceClimateConceptId, targetId: data.targetClimateConceptId }));
          globalSigmaInstance?.getGraph().addEdge(data.sourceClimateConceptId, data.targetClimateConceptId, { size: 2 });
          break;
        case 'DeletedEdge':
          dispatch(deleteClimateConceptEdge({ sourceId: data.sourceClimateConceptId, targetId: data.targetClimateConceptId }));
          globalSigmaInstance?.getGraph().dropEdge(data.sourceClimateConceptId, data.targetClimateConceptId);
          break;

        case 'UpdatedClimateConceptPosition':
          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'x', data.x);
          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'y', data.y);
          break;
        case 'UpdatedLabel':
          dispatch(updateClimateConceptLabel({
            id: data.climateConceptId,
            label: data.label,
            value: data.value,
          }));
          
          if (data.label === 'NeedsReview') {
            globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'needsReview', data.value);
          } else if (data.label === 'NeedsCorrection') {
            globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'needsCorrection', data.value);
          }

          const attributes = globalSigmaInstance?.getGraph().getNodeAttributes(data.climateConceptId);

          let color = '#999';
          if (attributes?.needsReview) {
            color = '#008bff';
          }

          if (attributes?.needsCorrection) {
            color = '#f00';
          }

          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'color', color);
          break;
        //#endregion
        
        //#region SummaryNode Events
        case 'AddedSummaryNode':
          dispatch(newSummaryNode({ id: data.id, x: data.x, y: data.y, combinedNode: data.combinedNodes }));
          globalSigmaInstance
            ?.getGraph()
            .addNode(data.id, {
              x: data.x,
              y: data.y,
              size: 5,
              label: '',
              forceLabel: true,
              hidden: false,
          });

          // Add the connections
          const incomingNodes: string[] = [];
          const outgoingNodes: string[] = [];
          data.combinedNodes.forEach((id: string) => {            
            globalSigmaInstance?.getGraph().forEachInNeighbor(id, (neighbor: string) => incomingNodes.push(neighbor));
            globalSigmaInstance?.getGraph().forEachOutNeighbor(id, (neighbor: string) => outgoingNodes.push(neighbor));
                        
            globalSigmaInstance?.getGraph().setNodeAttribute(id, 'hidden', true);
          });

          try {
            incomingNodes.forEach(id => {
              globalSigmaInstance?.getGraph().addEdge(id, data.id, { size: 2 });
            });
          } catch {}
          try {
            outgoingNodes.forEach(id => {
              globalSigmaInstance?.getGraph().addEdge(data.id, id, { size: 2 });
            });
          } catch {}

          break;
        
        case 'DeletedSummaryNode':
          getCombinedNodesForSummaryNode(data.id).forEach(node => {
            globalSigmaInstance?.getGraph().setNodeAttribute(node, 'hidden', false);
          })
          try {
            globalSigmaInstance?.getGraph().dropNode(data.id);
          } catch {}
          dispatch(deleteSummaryNode(data.id));
          break;

        case 'AddedToSummaryNode':
          // Add the climate concept node to the arrays of combined nodes
          // and hide it if summary nodes are shown
          data.newNodes.forEach((ccId: string) => {
            dispatch(addCombinedNode({ summaryNodeId: data.id, climateConceptId: ccId }))
            if (summaryNodesVisible) {
              globalSigmaInstance?.getGraph().setNodeAttribute(ccId, 'hidden', true);
            }

            // Add the climate concept node edges also to the summary node
            apiClient.getClimateConceptNode(ccId)
              .then(node => {
                if (node === null) {
                  return;
                }
                
                try {
                  node.climateConcept.incomingConnections.forEach(id => {
                    globalSigmaInstance?.getGraph().addEdge(id, data.id, { size: 2 });
                  });
                } catch {}
                try {
                  node.climateConcept.outgoingConnections.forEach(id => {
                    globalSigmaInstance?.getGraph().addEdge(data.id, id, { size: 2 });
                  });
                } catch {}
              });
          });
          
          break;

        case 'DeletedFromSummaryNode':
          // Remove the climate concept node from the arrays of combined nodes
          // and show it again if summary nodes are shown
          data.deletedNodes.forEach((ccId: string) => {
            const deleteFromSummaryNode = async () => {
              globalSigmaInstance?.getGraph().setNodeAttribute(ccId, 'hidden', false);
              
              // Get the list of combined nodes of the summary node
              let summaryNode: SummaryNodeModel;
              try {
                summaryNode = await apiClient.getSummaryNode(data.id);
              } catch {
                return;
              }

              const incomingNodes: { [key: string]: number } = {};
              const outgoingNodes: { [key: string]: number } = {};
              
              summaryNode.combinedNodes.forEach(combinedNode => {
                // Get all the incoming nodes for all combined nodes
                globalSigmaInstance?.getGraph().forEachInNeighbor(combinedNode, (neighbor) => {
                  if (validate(neighbor) || neighbor === combinedNode) {
                    return;
                  }

                  if (incomingNodes[neighbor]) {
                    incomingNodes[neighbor] = incomingNodes[neighbor] + 1;
                  } else {
                    incomingNodes[neighbor] = 1;
                  }
                });

                // Get all the outgoing nodes for all combined nodes
                globalSigmaInstance?.getGraph().forEachOutNeighbor(combinedNode, (neighbor) => {
                  if (validate(neighbor) || neighbor === combinedNode) {
                    return;
                  }
                  
                  if (outgoingNodes[neighbor]) {
                    outgoingNodes[neighbor] = outgoingNodes[neighbor] + 1;
                  } else {
                    outgoingNodes[neighbor] = 1;
                  }
                });
              });
              
              dispatch(removeCombinedNode({ summaryNodeId: data.id, climateConceptNodeId: ccId }));

              // Remove the climate concept node edges also from the summary node
              const node = await apiClient.getClimateConceptNode(ccId);
              if (node === null) {
                return;
              }
              
              try {
                node.climateConcept.incomingConnections.forEach(id => {
                  if (!incomingNodes[id]) {
                    globalSigmaInstance?.getGraph().dropEdge(id, data.id);
                  }
                });
              } catch {}
              try {
                node.climateConcept.outgoingConnections.forEach(id => {
                  if (!outgoingNodes[id]) {
                    globalSigmaInstance?.getGraph().dropEdge(data.id, id);
                  }
                });
              } catch {}
            }

            deleteFromSummaryNode();
          });
          break;
        
        case 'RenamedSummaryNode':
          dispatch(updateSummaryNodeName({ id: data.id, newName: data.newName }));
          globalSigmaInstance?.getGraph().setNodeAttribute(data.id, 'label', data.newName);
          break;

        case 'RepositionedSummaryNode':
          globalSigmaInstance?.getGraph().setNodeAttribute(data.id, 'x', data.newX);
          globalSigmaInstance?.getGraph().setNodeAttribute(data.id, 'y', data.newY);
          break;
        //#endregion
        
        default:
          console.log('Received unhandled message through web socket of type ' + data.eventType);  
      }
    }
  }
  
  // On initialization, create the web socket and define the event listener onmessage
  useEffect(() => {
    if (globalSigmaInstance === null) {
      return;
    }

    connect();

    return () => ws.close();
    // eslint-disable-next-line
  }, [globalSigmaInstance, summaryNodesVisible]);
}

export default useWebSocket;
