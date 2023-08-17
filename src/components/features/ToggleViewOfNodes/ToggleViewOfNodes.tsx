import { useState } from 'react';
import { useSigma } from '@react-sigma/core';
import { Fab, Tooltip } from '@mui/material';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';

import { ConnectionUseCases } from 'business-logic';
import { useAppDispatch } from '../../../store/redux/hooks';
import { setGroupedView } from '../../../store/redux/slices/graphSlice';

function ToggleViewOfNodes() {
  const dispatch = useAppDispatch();

  const sigma = useSigma();
  const [showGroupedNodes, setShowGroupedNodes] = useState(false);

  async function showAllSummaryNodes() {
    const connections = sigma.getGraph().edges().map((edgeId) => {
      return {
        id: edgeId,
        sourceId: sigma.getGraph().source(edgeId),
        targetId: sigma.getGraph().target(edgeId),
        type: sigma.getGraph().getEdgeAttribute(edgeId, 'connectionType'),
      };
    });

    const groupedNodesWithConnections = ConnectionUseCases.getAllSummaryNodesWithConnections(connections);

    groupedNodesWithConnections.groupedNodes.forEach((group) => {
      const id = group[0].id;
      const attributes = sigma.getGraph().getNodeAttributes(id);

      try {
        sigma.getGraph().addNode(attributes.label, {
          label: attributes.label,
          x: attributes.x,
          y: attributes.y,
          size: 5,
          forceLabel: true,
          hidden: false,
        });
      } catch {
        sigma.getGraph().setNodeAttribute(attributes.label, 'hidden', false);
      }
    });
  }

  async function switchView() {
    dispatch(setGroupedView(!showGroupedNodes));

    const connections = sigma.getGraph().edges().map((edgeId) => {
      return {
        id: edgeId,
        sourceId: sigma.getGraph().source(edgeId),
        targetId: sigma.getGraph().target(edgeId),
        type: sigma.getGraph().getEdgeAttribute(edgeId, 'connectionType'),
      };
    });

    const groupedNodesWithConnections = ConnectionUseCases.getAllSummaryNodesWithConnections(connections);

    if (showGroupedNodes) {
      // Switch from grouped to individual

      // Show all individual nodes
      sigma.getGraph().nodes().forEach((node) => {
          sigma.getGraph().setNodeAttribute(node, 'hidden', false);
        });

      // Delete grouped nodes
      sigma.getGraph().nodes().forEach((node) => {
        const size = sigma.getGraph().getNodeAttribute(node, 'size');
        if (size === 5) {
          sigma.getGraph().dropNode(node);
        }
      });
    } else {
      // Switch from individual to grouped

      // Hide all individual nodes that are part of a group
      groupedNodesWithConnections.groupedNodes.forEach((group) => {
        group.forEach((node) => {
          sigma.getGraph().setNodeAttribute(node.id, 'hidden', true);
        });
      });

      // Show summary nodes
      await showAllSummaryNodes();

      // Add Connections
      groupedNodesWithConnections.connections.forEach((connections, index) => {
        connections.forEach((connection) => {
          const isSourcePartOfGroup = groupedNodesWithConnections.groupedNodes[index].some(
            (node) => node.id === connection.sourceId
          );
          const isTargetPartOfGroup = groupedNodesWithConnections.groupedNodes[index].some(
            (node) => node.id === connection.targetId
          );
          if (isSourcePartOfGroup) {
            const attributes = sigma.getGraph().getEdgeAttributes(connection.id);
            const label = sigma.getGraph().getNodeAttribute(groupedNodesWithConnections.groupedNodes[index][0].id, 'label');

            const isTargetPartOfAnyGroup = groupedNodesWithConnections.groupedNodes.findIndex(
              (group) => group.some((node) => node.id === connection.targetId)
            );
            if (isTargetPartOfAnyGroup >= 0) {
              const targetLabel = sigma.getGraph().getNodeAttribute(groupedNodesWithConnections.groupedNodes[isTargetPartOfAnyGroup][0].id, 'label');
              try {
                sigma.getGraph().addEdgeWithKey(connection.id + ' ', label, targetLabel, { ...attributes });
              } catch {}
            }

            try {
              sigma.getGraph().addEdgeWithKey(connection.id + ' ', label, connection.targetId, { ...attributes });
            } catch {}
          } else if (isTargetPartOfGroup) {
            const attributes = sigma.getGraph().getEdgeAttributes(connection.id);
            const label = sigma.getGraph().getNodeAttribute(groupedNodesWithConnections.groupedNodes[index][0].id, 'label');

            const isSourcePartOfAnyGroup = groupedNodesWithConnections.groupedNodes.findIndex(
              (group) => group.some((node) => node.id === connection.sourceId)
            );
            if (isSourcePartOfAnyGroup >= 0) {
              const sourceLabel = sigma.getGraph().getNodeAttribute(groupedNodesWithConnections.groupedNodes[isSourcePartOfAnyGroup][0].id, 'label');
              try {
                sigma.getGraph().addEdgeWithKey(connection.id + ' ', sourceLabel, label, { ...attributes });
              } catch {}
            }

            try {
              sigma.getGraph().addEdgeWithKey(connection.id + ' ', connection.sourceId, label, { ...attributes });
            } catch {}
          }
        });
      });
    }

    setShowGroupedNodes((prevState) => !prevState);
  }

  return (
    <div style={{ position: 'absolute', right: 50, top: 70 }}>
      <Tooltip title={showGroupedNodes ? 'Show Individual Nodes' : 'Show Grouped Nodes'}>
        <Fab size='small' style={{ background: 'white' }} onClick={switchView}>
          {showGroupedNodes ? <ScatterPlotIcon /> : <GroupWorkOutlinedIcon />}
        </Fab>
      </Tooltip>
    </div>
  );
}

export default ToggleViewOfNodes;
