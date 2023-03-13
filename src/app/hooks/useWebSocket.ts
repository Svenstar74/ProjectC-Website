import { useContext, useEffect } from "react";

import { useAppSelector } from "../store/redux/hooks";
import { AppContext } from "../store/context/AppContext";

export const useWebSocket = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { globalSigmaInstance } = useContext(AppContext);

  // On initialization, create the web socket and define the event listener onmessage
  useEffect(() => {
    const url = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8000/';
    const ws = new WebSocket(url + user)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.eventType) {
        case 'AddedNode':
          globalSigmaInstance?.getGraph().addNode(data.climateConceptId, {
            nodeId: data.nodeId,
            x: data.x,
            y: data.y,
            label: data.stringRepresentation,
            forceLabel: true,
          });
          break;
        case 'AddedEdge':
          globalSigmaInstance?.getGraph().addEdge(data.sourceClimateConceptId, data.targetClimateConceptId, { size: 2 });
          break;
        case 'UpdatedPosition':
          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'x', data.x);
          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'y', data.y);
          break;
        case 'UpdatedStringRepresentation':
          globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'label', data.stringRepresentation)
          break;
        case 'DeletedNode':
          globalSigmaInstance?.getGraph().dropNode(data.climateConceptId);
          break;
        case 'DeletedEdge':
          globalSigmaInstance?.getGraph().dropEdge(data.sourceClimateConceptId, data.targetClimateConceptId);
          break;
        default:
          console.log('Received unhandled message through web socket of type ' + data.eventType);
      }
    }
  });
}
