import { useContext } from 'react';

import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, ZoomControl } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';

import { LoadGraph } from './LoadGraph';
import { GraphEventsMoveTool } from './GraphEventsMoveTool';
import { GraphEventsSelectTool } from './GraphEventsSelectTool';
import ArrowEdgeProgram from './customPrograms/edge.arrow';
import { AppContext } from '../../store/context/AppContext';
import { useAppSelector } from '../../store/redux/hooks';
import classes from './DisplayGraph.module.css';

export const DisplayGraph = () => {
  const { setSigmaInstance } = useContext(AppContext);
  const selectedTool = useAppSelector((state) => state.tool.selectedTool);

  return (
    <div className={classes.sigmaContainer}>
      <SigmaContainer
        ref={(sigma) => {
          if (sigma) {
            setSigmaInstance(sigma);
          }
        }}
        settings={{
          defaultEdgeType: 'arrow',
          labelSize: 2,
          edgeProgramClasses: { arrow: ArrowEdgeProgram },
        }}
        style={{ width: '100%', height: '100%' }}
      >

        {selectedTool === 0 && <GraphEventsMoveTool />}
        {selectedTool === 1 && <GraphEventsSelectTool />}
        
        <LoadGraph />

        <ControlsContainer position="top-right">
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>

        <ControlsContainer position="bottom-right">
          <SearchControl style={{ width: '200px' }} />
        </ControlsContainer>

      </SigmaContainer>
    </div>
  );
};
