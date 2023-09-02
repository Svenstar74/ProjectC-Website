import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import useApiClient from '../../hooks/useApiClient';
import { useAppSelector } from '../../../store/redux/hooks';

function GraphEvents() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();
  
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>();

  useEffect(() => {
    registerEvents({
      downNode(e) {
        if (e.event.original.button === 0 && !isNaN(e.node) && isLoggedIn) {
          setDraggedNode(e.node);
          setStartPos({ x: e.event.x, y: e.event.y });
        }
      },
      mousemove(e) {
        if (draggedNode) {
          // Set new position
          const pos = sigma.viewportToGraph(e);
          sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

          // Prevent sigma to move camera
          e.preventSigmaDefault();
          e.original.preventDefault();
          e.original.stopPropagation();
        }
      },
      mouseup(e) {
        if (draggedNode) {
          if (startPos && (startPos.x !== e.x || startPos.y !== e.y)) {
            const pos = sigma.viewportToGraph(e);
            apiClient.updateClimateConceptNodePosition(draggedNode, pos.x, pos.y);
          }
        }

        setDraggedNode(null);
      },
    });
  }, [sigma, registerEvents, draggedNode, isLoggedIn]);

  return null;
}

export default GraphEvents;
