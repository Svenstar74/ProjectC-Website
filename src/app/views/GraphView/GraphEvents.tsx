import { useEffect, useState } from 'react';

import { useApiClient } from '../../hooks/useApiClient';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { useAppDispatch, useAppSelector } from '../../store/redux/hooks';
import { clearSelectedEdge, clearSelectedNode, setSelectedEdge, setSelectedNode } from '../../store/redux/graphSlice';
import { ContextMenu } from '../../components/ContextMenu';

export const GraphEvents = () => {
  const apiClient = useApiClient();
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const selectedNode = useAppSelector((state) => state.graph.selectedNode);
  const dispatch = useAppDispatch();

  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
  const [contextMenuOptions, setContextMenuOptions] = useState<string[]>([]);
  const [clickedNodeId, setClickedNodeId] = useState('');
  const [clickedEdgeNodeIds, setClickedEdgeNodeIds] = useState({ cause: '', effect: '' });

  // When zooming in or out, change the node labels font size
  useEffect(() => {
    sigma.getCamera().on('updated', (state) => {
      sigma.setSetting('labelSize', Math.min(2 / state.ratio, 20));
    });
  }, [sigma]);

  useEffect(() => {
    registerEvents({
      downNode: (e) => {
        if (e.event.original.button === 0) {
          if (selectedNode) {
            sigma
              .getGraph()
              .removeNodeAttribute(selectedNode.node, 'highlighted');
          }

          setDraggedNode(e.node);
          sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
        }
      },
      rightClickNode: (e) => {
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['deleteNode', 'addEdge']);
        setClickedNodeId(e.node);
      },
      rightClickEdge: (e) => {
        const source = sigma.getGraph().source(e.edge);
        const target = sigma.getGraph().target(e.edge);

        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['deleteEdge']);
        setClickedEdgeNodeIds({ cause: source, effect: target });
      },
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);

          const nodeAttributes = sigma
            .getGraph()
            .getNodeAttributes(draggedNode);

          dispatch(
            setSelectedNode({
              node: draggedNode,
              x: nodeAttributes.x,
              y: nodeAttributes.y,
              label: nodeAttributes.label,
              size: nodeAttributes.size,
            })
          );

          // TODO: Update only if position has changed
          apiClient.updateNodePosition(
            nodeAttributes.nodeId,
            nodeAttributes.x,
            nodeAttributes.y
          );
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
    
        dispatch(setSelectedEdge([sourceId, sourceString, targetId, targetString]));
      },
      clickStage: () => {
        if (selectedNode) {
          sigma
            .getGraph()
            .removeNodeAttribute(selectedNode.node, 'highlighted');
        }

        dispatch(clearSelectedNode());
        dispatch(clearSelectedEdge());
      },
      rightClickStage: (e) => {
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['addNode']);
      },
      doubleClickStage: (e) => {
        // Do not zoom in with double clicks
        e.preventSigmaDefault();
      },
    });
    // eslint-disable-next-line
  }, [registerEvents, sigma, draggedNode, selectedNode]);

  return (
    <ContextMenu
      show={showContextMenu}
      position={contextMenuPosition}
      menuItems={contextMenuOptions}
      onClose={() => setShowContextMenu(false)}
      clickedNodeId={clickedNodeId}
      clickedEdgeNodeIds={clickedEdgeNodeIds}
    />
  );
};
