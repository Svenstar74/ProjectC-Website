import { useEffect } from 'react';
import Graph from 'graphology';
import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, useLoadGraph, ZoomControl } from '@react-sigma/core';

import '@react-sigma/core/lib/react-sigma.min.css';

import classes from './DisplayGraph.module.css';
import { GraphEvents } from './GraphEvents';
import ArrowEdgeProgram from './edge.arrow';

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph({
      allowSelfLoops: false,
      multi: false,
      type: 'directed',
    });
    graph.addNode('A', { x: 0, y: 0, label: 'Cause1', size: 10 });
    graph.addNode('B', { x: 1, y: 1, label: 'Effect', size: 10 });
    graph.addNode('C', { x: 2, y: 2, label: 'Test', size: 10 });
    graph.addNode('D', { x: 2, y: 2, label: 'Cause2', size: 10 });
    graph.addEdge('A', 'B', { size: 5 });

    for (let i = 0; i < 100; i++) {
      graph.addNode(i, {
        x: Math.random() * 4,
        y: Math.random() * 4,
        size: 4,
      });
    }

    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const DisplayGraph = () => {
  return (
    <div className={classes.sigmaContainer}>
      <SigmaContainer
        settings={{
          defaultEdgeType: 'arrow',
          edgeProgramClasses: { arrow: ArrowEdgeProgram },
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
          <SearchControl style={{ width: "200px" }} />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
};
