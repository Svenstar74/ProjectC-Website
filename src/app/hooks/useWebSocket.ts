import { useEffect } from "react";
import Sigma from "sigma";

import { useAppSelector } from "../store/hooks";

export const useWebSocket = (sigma: Sigma | null) => {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const url = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000/';
    const ws = new WebSocket(url + user)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      console.log('Received: ');
      console.log(data);

      if (data.eventType === 'UpdatedPosition') {
        sigma?.getGraph().setNodeAttribute(data.climateConceptId, 'x', data.x);
        sigma?.getGraph().setNodeAttribute(data.climateConceptId, 'y', data.y);
      } else if (data.eventType === 'UpdatedStringRepresentation') {
        sigma?.getGraph().setNodeAttribute(data.climateConceptId, 'label', data.stringRepresentation);
      } else if (data.eventType === 'AddedNode') {
        sigma?.getGraph().addNode(data.climateConceptId, {
          nodeId: data.nodeId,
          x: data.x,
          y: data.y,
          label: data.stringRepresentation,
          forceLabel: true,
        });
      } else if (data.eventType === 'DeletedNode') {
        sigma?.getGraph().dropNode(data.climateConceptId);
      } else if (data.eventType === 'AddedEdge') {
        sigma?.getGraph().addEdge(data.sourceClimateConceptId, data.targetClimateConceptId, { size: 2 });
      } else if (data.eventType === 'DeletedEdge') {
        sigma?.getGraph().dropEdge(data.sourceClimateConceptId, data.targetClimateConceptId);
      }
    }
  });
}
