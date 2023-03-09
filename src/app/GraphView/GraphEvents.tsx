import React, { useEffect, useState } from 'react';

import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearSelectedNode, setSelectedNode } from '../store/graphSlice';

export const GraphEvents: React.FC = () => {
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);
  const dispatch = useAppDispatch();
  
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);

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
      clickStage: () => {
        if (selectedNode) {
          sigma.getGraph().removeNodeAttribute(selectedNode.node, 'highlighted');
        }
        dispatch(clearSelectedNode());
      },
      rightClickStage: (e) => {
        // showContextMenu
        // const pos = sigma.viewportToGraph(e.event);
        // sigma.getGraph().addNode('Test', {
        //   x: pos.x,
        //   y: pos.y,
        //   size: 10,
        // });
      },
      doubleClickStage: (e) => {
        e.preventSigmaDefault();
      },
      wheelStage: (e: any) => {
        // const currentFontSize = sigma.getSetting('labelSize');
        // const delta = e.event.delta;
        // sigma.setSetting('labelSize', currentFontSize! + delta);
        // sigma.getGraph().forEachNode(node => {
        //   sigma.getGraph().setNodeAttribute(node, 'fontSize', )
        // })
      }
    });
    // eslint-disable-next-line
  }, [registerEvents, sigma, draggedNode]);

  return null;
};
