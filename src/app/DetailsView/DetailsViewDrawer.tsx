import { ClimateConceptModel } from '@svenstar74/business-logic';
import { useEffect, useState } from 'react';
import { useApiClient } from '../hooks/useApiClient';
import { useAppSelector } from '../store/hooks';
import classes from './DetailsViewDrawer.module.css';

export const DetailsViewDrawer = () => {
  const apiClient = useApiClient();
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);

  const [climateConcept, setClimateConcept] = useState<ClimateConceptModel>()
  
  useEffect(() => {
    if (selectedNode) {
      apiClient.getClimateConcept(selectedNode.node)
        .then(result => setClimateConcept(result));
    }
  }, [selectedNode])
  
  return (
    <div className={classes.container}>
      <div className={classes.header}>NODE ATTRIBUTES</div>
      <div className={classes.content}>
        {selectedNode && climateConcept && (
          <div>
            <h4>{selectedNode.label}</h4>
            <p>
              x: {selectedNode.x.toFixed(2)} &emsp; y:{' '}
              {selectedNode.y.toFixed(2)} &emsp; size: {selectedNode.size}
            </p>
            <p>Connected Causes</p>
            { climateConcept.incomingConnections.map(con => <li key={con}>{con}</li>)}
            <p>Connected Effects</p>
            { climateConcept.outgoingConnections.map(con => <li key={con}>{con}</li>)}
          </div>
        )}
      </div>
    </div>
  );
};
