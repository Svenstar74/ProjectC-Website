import Graph from "graphology";
import { useLoadGraph } from "@react-sigma/core";

import { useApiClient } from "../../hooks/useApiClient";
import { AggregatedNodeModel } from "@svenstar74/business-logic";
import { useEffect } from "react";

export const LoadGraph = () => {
  const apiClient = useApiClient();
  const loadGraph = useLoadGraph();
  
  useEffect(() => {
    // Fetch all nodes from the api
    apiClient.getAllNodesAggregated().then((data) => {
      // Create the empty graph
      const graph = new Graph({
        allowSelfLoops: false,
        multi: false,
        type: 'directed',
      });

      // For each node in the backend, create a node in the graph
      data.forEach((node: AggregatedNodeModel) => {
        graph.addNode(node.climateConcept.id, {
          nodeId: node.id,
          x: node.x,
          y: node.y,
          label: node.climateConcept.stringRepresentation,
          forceLabel: true,
        });
      });

      // Again for each node, add the connections in the graph
      data.forEach((node: AggregatedNodeModel) => {
        node.climateConcept.incomingConnections.forEach((connection: string) => {
          try {
            graph.addEdge(connection, node.climateConcept.id, { size: 2 });
          } catch {}
        });
  
        node.climateConcept.outgoingConnections.forEach((connection: string) => {
          try {
            graph.addEdge(node.climateConcept.id, connection, { size: 2 });
          } catch {}
        });
      });

      /** With the snippet below, you can reinitialize the positions of each node. */
      // const sensibleSettings = forceAtlas2.inferSettings(graph);
      // forceAtlas2.assign(graph, {
      //   iterations: 1000,
      //   settings: sensibleSettings,
      // });
      
      loadGraph(graph);
    });
  // eslint-disable-next-line
  }, []);
  
  return null;
};
