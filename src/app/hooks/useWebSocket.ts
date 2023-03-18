import { useContext, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../store/redux/hooks';
import { AppContext } from '../store/context/AppContext';
import { clearSelectedNode } from '../store/redux/graphSlice';

export const useWebSocket = () => {
  const url = process.env.REACT_APP_WS_BASE_URL ?? '';
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const appContext = useContext(AppContext);

  const connect = () => {
    const ws = new WebSocket(url + user);
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
        case 'AddedNode':
          appContext.globalSigmaInstance
            ?.getGraph()
            .addNode(data.climateConceptId, {
              nodeId: data.nodeId,
              x: data.x,
              y: data.y,
              label: data.stringRepresentation,
              forceLabel: true,
            });
          break;
        case 'AddedEdge':
          appContext.globalSigmaInstance?.getGraph().addEdge(data.sourceClimateConceptId, data.targetClimateConceptId, { size: 2 });
          break;
        case 'UpdatedPosition':
          appContext.globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'x', data.x);
          appContext.globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'y', data.y);
          break;
        case 'UpdatedStringRepresentation':
          appContext.globalSigmaInstance?.getGraph().setNodeAttribute(data.climateConceptId, 'label', data.stringRepresentation)
          break;
        case 'DeletedNode':
          appContext.globalSigmaInstance?.getGraph().dropNode(data.climateConceptId);
          dispatch(clearSelectedNode());
          break;
        case 'DeletedEdge':
          appContext.globalSigmaInstance?.getGraph().dropEdge(data.sourceClimateConceptId, data.targetClimateConceptId);
          break;
        default:
          console.log('Received unhandled message through web socket of type ' + data.eventType);
      }
    };
  };

  // On initialization, create the web socket and define the event listener onmessage
  useEffect(() => {
    if (appContext.globalSigmaInstance === null) {
      return;
    }

    connect();
    // eslint-disable-next-line
  }, [appContext.globalSigmaInstance]);
};
