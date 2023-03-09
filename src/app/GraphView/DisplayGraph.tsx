import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  ZoomControl,
} from '@react-sigma/core';

import '@react-sigma/core/lib/react-sigma.min.css';

import { AggregatedNodeModel } from '@svenstar74/business-logic/build/src/adapters/Nodes.repository';
import classes from './DisplayGraph.module.css';
import { GraphEvents } from './GraphEvents';
import ArrowEdgeProgram from './customPrograms/edge.arrow';
import { ApiClient } from '../ApiClient/ApiClient';

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  new ApiClient().getAllNodesAggregated().then((data) => {
    const graph = new Graph({
      allowSelfLoops: false,
      multi: false,
      type: 'directed',
    });

    data.forEach((node: AggregatedNodeModel) => {
      graph.addNode(node.climateConcept.id, {
        x: Math.random(),
        y: Math.random(),
        label: node.climateConcept.stringRepresentation,
        forceLabel: true,
      });
    });

    data.forEach((node: AggregatedNodeModel) => {
      node.climateConcept.incomingConnections.forEach((connection) => {
        try {
          graph.addEdge(connection, node.climateConcept.id, { size: 2 });
        } catch {}
      });

      node.climateConcept.outgoingConnections.forEach((connection) => {
        try {
          graph.addEdge(node.climateConcept.id, connection, { size: 2 });
        } catch {}
      });
    });

    forceAtlas2.assign(graph, {
      iterations: 100,
      settings: {
        gravity: 8,
      },
    });

    loadGraph(graph);
  });

  return null;
};

export const DisplayGraph = () => {
  return (
    <div className={classes.sigmaContainer}>
      <SigmaContainer
        settings={{
          defaultEdgeType: 'arrow',
          labelSize: 2,
          edgeProgramClasses: { arrow: ArrowEdgeProgram },
          // nodeProgramClasses: {
          //   border: NodeProgramBorder
          // }
          // labelRenderer(context, data, settings) {
          //   drawLabel(context, data, settings)
          // },
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <GraphEvents />
        <LoadGraph />
        <ControlsContainer position='top-right'>
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
        <ControlsContainer position='bottom-right'>
          <SearchControl style={{ width: '200px' }} />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
};
