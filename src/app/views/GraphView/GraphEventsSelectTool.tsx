/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { NodeModel, ToolService } from '@svenstar74/business-logic';
import { useApiClient } from '../../hooks/useApiClient';

export const GraphEventsSelectTool = () => {
  const apiClient = useApiClient();
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  
  const canvas = sigma.getCanvases().mouse;
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  let selectedNodes: NodeModel[] = [];
  
  let dragActive = false;
  let dragStart = {x: 0, y: 0};
  
  let selectionActive = false;
  
  let selectionStartViewX = 0;
  let selectionStartViewY = 0;
  
  let selectionEndViewX = 0;
  let selectionEndViewY = 0;

  let selectionStartGraphX = 0;
  let selectionStartGraphY = 0;
  
  useEffect(() => {
    registerEvents({
      downNode(e) {
        if (e.event.original.button === 0) {
          dragActive = true;
          dragStart = sigma.viewportToGraph(e.event);
        }
      },
      enterNode() {
        canvas.style.cursor = 'grab';
      },
      leaveNode() {
        if (!dragActive) {
          canvas.style.cursor = 'default';
        }
      },
      mousedown(event) {        
        if (!dragActive && event.original.button === 0) {
          selectionActive = true;

          sigma.getGraph().forEachNode(node => { 
            sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
          });

          selectionStartViewX = event.original.x;
          selectionStartViewY = event.original.y;
          
          const graphCoordinates = sigma.viewportToGraph(event);
          selectionStartGraphX = graphCoordinates.x;
          selectionStartGraphY = graphCoordinates.y;
        }
      },
      mouseup(event) {
        if (dragActive) {
          sigma.getGraph().forEachNode(node => { 
            sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
          });
          
        }
        
        if (dragActive) {
          selectedNodes.forEach(node => {
            const attributes = sigma.getGraph().getNodeAttributes(node.climateConceptId);
            apiClient.updateNodePosition(attributes.nodeId, attributes.x, attributes.y);
          });
        }
        
        
        
        if (event.original.button === 0) {       
          selectionActive = false;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height)

          const listOfNodes: NodeModel[] = []
          sigma.getGraph().forEachNode(node => {
            const attributes = sigma.getGraph().getNodeAttributes(node);
            listOfNodes.push({
              id: attributes.nodeId,
              x: attributes.x,
              y: attributes.y,
              climateConceptId: node,
            })
          });
          
          if (!dragActive) {
            const graphCoordinates = sigma.viewportToGraph(event);

            selectedNodes = ToolService.rectangularSelection([selectionStartGraphX, selectionStartGraphY], [graphCoordinates.x, graphCoordinates.y], listOfNodes);
            selectedNodes.forEach(node => {
              sigma.getGraph().setNodeAttribute(node.climateConceptId, 'highlighted', true);
            });
          }

          dragActive = false;
        }
      },
      mousemove(e) {
        // Don't move with mouse click
        e.preventSigmaDefault();

        if (!dragActive && selectionActive) {
          selectionEndViewX = e.original.x;
          selectionEndViewY = e.original.y;
          
          const start = { x: Math.min(selectionStartViewX, selectionEndViewX), y: Math.min(selectionStartViewY, selectionEndViewY) };
          const end = { x: Math.max(selectionStartViewX, selectionEndViewX), y: Math.max(selectionStartViewY, selectionEndViewY) };
          
          const width = end.x - start.x;
          const height = end.y - start.y;

          canvasContext.clearRect(0, 0, canvas.width, canvas.height)
          canvasContext.strokeRect(start.x, start.y, width, height);
        }

        if (dragActive) {
          const coords = sigma.viewportToGraph(e);

          const deltaX = coords.x - dragStart.x;
          const deltaY = coords.y - dragStart.y;

          selectedNodes.forEach(node => {
            sigma.getGraph().setNodeAttribute(node.climateConceptId, 'x', node.x + deltaX);
            sigma.getGraph().setNodeAttribute(node.climateConceptId, 'y', node.y + deltaY);
          })
        }
      },
      doubleClickStage: (e) => {
        // Do not zoom in with double clicks
        e.preventSigmaDefault();
      },
    });
    // eslint-disable-next-line
  }, [registerEvents, sigma]);

  return null;
};
