import React, { useEffect, useState } from 'react';

import { useRegisterEvents, useSigma } from '@react-sigma/core';

export const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
      },
      mouseup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted');
        }
      },
      mousemove: (e) => {
        if (draggedNode) {
          // Get new position of node
          const pos = sigma.viewportToGraph(e);

          sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
          sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

          // Prevent sigma to move camera:
          e.preventSigmaDefault();
        }
      },
      rightClickStage: (e) => {
        const pos = sigma.viewportToGraph(e.event);
        sigma.getGraph().addNode('Test', {
          x: pos.x,
          y: pos.y,
          size: 10,
        });
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};
