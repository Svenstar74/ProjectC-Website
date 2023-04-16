import { useContext } from 'react';
import { ControlsContainer, FullScreenControl, SearchControl, SigmaContainer, ZoomControl } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';

import { AppContext } from '../../store/context/AppContext';
import ArrowEdgeProgram from './customPrograms/edge.arrow';

import classes from './DisplayGraph.module.css';
import { GraphEventsMoveTool } from './GraphEventsMoveTool';
import { useAppSelector } from '../../store/redux/hooks';
import { GraphEventsSelectTool } from './GraphEventsSelectTool';

export const DisplayGraph = () => {
  const selectedTool = useAppSelector(state => state.tool.selectedTool);
  const { setSigmaInstance } = useContext(AppContext);

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
          labelSize: 2.5,
          edgeProgramClasses: { arrow: ArrowEdgeProgram },
        }}
      >
        {selectedTool === 0 && <GraphEventsMoveTool />}
        {selectedTool === 1 && <GraphEventsSelectTool />}
        
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
