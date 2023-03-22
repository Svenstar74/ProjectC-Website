import { useEffect } from 'react';
import Graph from 'graphology';
import { useLoadGraph } from '@react-sigma/core';

import { AggregatedNodeModel } from '@svenstar74/business-logic';
import { useApiClient } from '../../hooks/useApiClient';

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
        let color = '#999';
        if (node.needsReview) {
          color = '#008bff';
        }

        if (node.needsCorrection) {
          color = '#f00';
        }

        graph.addNode(node.climateConcept.id, {
          x: node.x,
          y: node.y,
          color,
          label: node.climateConcept.stringRepresentation,
          needsReview: node.needsReview,
          needsCorrection: node.needsCorrection,
          forceLabel: true,
        });
      });

      // Again for each node, add the connections in the graph
      data.forEach((node: AggregatedNodeModel) => {
        node.climateConcept.incomingConnections.forEach(
          (connection: string) => {
            try {
              graph.addEdge(connection, node.climateConcept.id, { size: 2 });
            } catch {}
          }
        );

        node.climateConcept.outgoingConnections.forEach(
          (connection: string) => {
            try {
              graph.addEdge(node.climateConcept.id, connection, { size: 2 });
            } catch {}
          }
        );
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
