import { useEffect, useState } from "react";
import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { validate } from 'uuid';

import { useAppDispatch } from "../../store/redux/hooks";
import { setLastSelected } from "../../store/redux/slices/graphSlice";
import { CameraState, MouseCoords } from "sigma/types";
import useApiClient from "../../hooks/useApiClient";
import ContextMenu from "../ContextMenu";

export const GraphEventsMoveTool = () => {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  //#region Drag&Drop
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [startPos, setStartPos] = useState<{ x: number, y: number }>();
  
  function startDragging(node: string, x: number, y: number) {
    setDraggedNode(node);
    setStartPos({ x, y });
    sigma.getGraph().setNodeAttribute(node, 'highlighted', true);
  }

  function onDragging(e: MouseCoords) {
    // Set new position
    const pos = sigma.viewportToGraph(e);
    sigma.getGraph().setNodeAttribute(draggedNode, 'x', pos.x);
    sigma.getGraph().setNodeAttribute(draggedNode, 'y', pos.y);

    // Prevent sigma to move camera
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  }
  
  function stopDragging(x: number, y: number) {
    if (draggedNode) {
      if (startPos && (startPos.x !== x || startPos.y !== y)) {
        const attributes = sigma.getGraph().getNodeAttributes(draggedNode!);
        if (validate(draggedNode!)) {
          // Summary Node moved
          apiClient.repositionSummaryNode(draggedNode!, attributes.x, attributes.y);
        } else {
          // ClimateConceptNode moved
          apiClient.updateClimateConceptNodePosition(draggedNode!, attributes.x, attributes.y);
        }
      }

      sigma.getGraph().removeNodeAttribute(draggedNode, 'highlighted');
    }

    setDraggedNode(null);
  }
  //#endregion

  //#region ContextMenu
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuOptions, setContextMenuOptions] = useState<('addNode' | 'deleteNode' | 'addEdge' | 'deleteEdge')[]>([]);
  //#endregion
  
  //#region When zooming in or out, change the node labels font size
  useEffect(() => {
    const listener = (state: CameraState) => {
      sigma.setSetting('labelSize', Math.min(2.5 / state.ratio, 30));
    };

    sigma.getCamera().on('updated', listener);

    return () => { sigma.getCamera().removeListener('updated', listener) }
  }, [sigma]);
  //#endregion
  
  useEffect(() => {
    registerEvents({
      downNode: (e) => {
        // Drag&Drop
        if (e.event.original.button === 0) {
          startDragging(e.node, e.event.x, e.event.y);
        }

        // For displaying the node details in the top left corner
        if (validate(e.node)) {
          dispatch(setLastSelected({ lastSelected: 'SummaryNode', data: e.node }));
        } else {
          dispatch(setLastSelected({ lastSelected: 'ClimateConceptNode', data: e.node }));
        }
        
      },
      downEdge: (e) => {
        // For displaying the edge details in the top left corner
        const sourceId = sigma.getGraph().source(e.edge);
        const targetId = sigma.getGraph().target(e.edge);

        dispatch(setLastSelected({ lastSelected: 'Edge', data: [sourceId, targetId] }));
      },
      mouseup: (e) => {
        // Drag&Drop
        stopDragging(e.x, e.y);
      },
      mousemove: (e) => {
        // Drag&Drop
        if (draggedNode) {
          onDragging(e);
        }
      },
      rightClickNode: (e) => {
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['deleteNode', 'addEdge']);
        setShowContextMenu(true);
      },
      rightClickEdge: (e) => {
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['deleteEdge']);
        setShowContextMenu(true);
      },
      rightClickStage: (e) => {
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
        setContextMenuOptions(['addNode']);
        setShowContextMenu(true);
      },
      doubleClickStage: (e) => {
        // Do not zoom in with double clicks
        e.preventSigmaDefault();
      },
    })
    // eslint-disable-next-line
  }, [registerEvents, sigma, draggedNode]);

  return (
    <>
      <ContextMenu
        show={showContextMenu}
        position={contextMenuPosition}
        menuItems={contextMenuOptions}
        onClose={() => setShowContextMenu(false)}
      />
    </>
  );
};
