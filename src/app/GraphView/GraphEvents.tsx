import React, { useEffect, useState } from 'react';

import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearSelectedEdge, clearSelectedNode, setSelectedEdge, setSelectedNode } from '../store/graphSlice';

export const GraphEvents: React.FC = () => {
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);
  const dispatch = useAppDispatch();
  
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    sigma.getCamera().on('updated', (state) => {
      sigma.setSetting('labelSize', Math.min(2 / state.ratio, 20));
    })
  }, [])
  
  useEffect(() => {
    // Register the events
    registerEvents({
      downNode: (e) => {
        if (selectedNode) {
          sigma.getGraph().removeNodeAttribute(selectedNode.node, 'highlighted');
        }

        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
      },
      mouseup: (e) => {
        if (draggedNode) {
          setDraggedNode(null);

          const nodeAttributes = sigma.getGraph().getNodeAttributes(draggedNode);
          dispatch(setSelectedNode({
            node: draggedNode,
            x: nodeAttributes.x,
            y: nodeAttributes.y,
            label: nodeAttributes.label,
            size: nodeAttributes.size,
          }));
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
      clickEdge: (e) => {        
        const sourceId = sigma.getGraph().source(e.edge);
        const targetId = sigma.getGraph().target(e.edge);

        const sourceString = sigma.getGraph().getNodeAttribute(sourceId, 'label');
        const targetString = sigma.getGraph().getNodeAttribute(targetId, 'label');
    
        // sigma.getGraph().setEdgeAttribute(e.edge, 'color', 'red');
        
        dispatch(setSelectedEdge([sourceString, targetString]));
      },
      clickStage: () => {
        if (selectedNode) {
          sigma.getGraph().removeNodeAttribute(selectedNode.node, 'highlighted');
        }

        dispatch(clearSelectedNode());
        dispatch(clearSelectedEdge());
      },
      doubleClickStage: (e) => {
        e.preventSigmaDefault();
      }
    });
    // eslint-disable-next-line
  }, [registerEvents, sigma, draggedNode]);

  return null;
};
