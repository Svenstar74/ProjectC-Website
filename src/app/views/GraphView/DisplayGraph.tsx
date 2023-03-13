import Graph from 'graphology';

import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useLoadGraph,
  ZoomControl,
} from '@react-sigma/core';

import '@react-sigma/core/lib/react-sigma.min.css';

import classes from './DisplayGraph.module.css';
import { GraphEvents } from './GraphEvents';
import ArrowEdgeProgram from './customPrograms/edge.arrow';
import { useApiClient } from '../../hooks/useApiClient';
import { useState, useContext } from 'react';
import Sigma from 'sigma';
import { AggregatedNodeModel } from '@svenstar74/business-logic';
import { AppContext } from '../../store/context/AppContext';

export const LoadGraph = () => {
  const apiClient = useApiClient();
  const loadGraph = useLoadGraph();

  apiClient.getAllNodesAggregated().then((data) => {
    const graph = new Graph({
      allowSelfLoops: false,
      multi: false,
      type: 'directed',
    });

    data.forEach((node: AggregatedNodeModel) => {
      graph.addNode(node.climateConcept.id, {
        nodeId: node.id,
        x: node.x,
        y: node.y,
        label: node.climateConcept.stringRepresentation,
        forceLabel: true,
      });
    });

    data.forEach((node: AggregatedNodeModel) => {
      node.climateConcept.incomingConnections.forEach((connection: string) => {
        try {
          graph.addEdge(connection, node.climateConcept.id, { size: 2 });
        } catch {}
      });

      node.climateConcept.outgoingConnections.forEach((connection: string) => {
        try {
          graph.addEdge(node.climateConcept.id, connection, { size: 2 });
        } catch {}
      });
    });

    // const sensibleSettings = forceAtlas2.inferSettings(graph);
    // console.log(sensibleSettings)
    // forceAtlas2.assign(graph, {
    //   iterations: 100,
    //   settings: {
    //     gravity: 0.05,
    //     scalingRatio: 10,
    //     slowDown: 7.366470447731438,
    //     strongGravityMode: true
    //   },
    // });        

    // graph.forEachNode((nodeId, attributes) => {
    //   apiClient.updateNodePosition(attributes.nodeId, attributes.x, attributes.y)
    // })
    
    loadGraph(graph);
  });

  return null;
};

export const DisplayGraph = () => { 
  const { setSigmaInstance } = useContext(AppContext);
  
  const [sigma, setSigma] = useState<Sigma | null>(null);
  
  
  
  return (
    <div className={classes.sigmaContainer}>
      <SigmaContainer
      ref={(sigma) => {
        setSigma(sigma);
        setSigmaInstance(sigma);
      }}
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
