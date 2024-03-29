import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";

import useApiClient from "../../../components/hooks/useApiClient";
import { ValidatableUseCases } from "business-logic";

function LoadGraphFromMongoDb() {
  const loadGraph = useLoadGraph();
  const apiClient = useApiClient();

  useEffect(() => {
    const graph = new Graph();

    apiClient.getAllClimateConceptNodes().then((data) => {
      data.forEach((node: any) => {
        const color = ValidatableUseCases.getColor(node, 'node');
        graph.addNode(node.id, { x: node.x, y: node.y, size: 2, label: node.name, forceLabel: true, color: color });
      });

      apiClient.getAllConnections().then((data) => {
        data.forEach((edge: any) => {
          let type = 'arrow';
          if (edge.type === 'isEqualTo') {
            type = 'line';
          }
          
          const color = ValidatableUseCases.getColor(edge, 'connection');
          
          if (type === 'line') {
            graph.addUndirectedEdgeWithKey(edge.id, edge.sourceId, edge.targetId, { size: 2, type, connectionType: edge.type, color });
          } else {
            graph.addEdgeWithKey(edge.id, edge.sourceId, edge.targetId, { size: 2, type, connectionType: edge.type, color });

            // Hide isA edges by default
            if (edge.type === 'isA') {
              graph.setEdgeAttribute(edge.id, 'hidden', true);
            }
          }

        });
      
        loadGraph(graph);
      });
    });
  });

  return null;
}

export default LoadGraphFromMongoDb;
