import { useAppSelector } from '../store/hooks';
import classes from './BottomDetailsView.module.css';
import { StringRepresentationForm } from './StringRepresentationForm';

export const BottomDetailsView = () => {  
  const last = useAppSelector((state) => state.graph.last);
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);
  const selectedEdge = useAppSelector((state) => state.graph.selectedEdge);
  
  return (
    <div className={classes.container}>
      {selectedNode && last === 'node' && <div className={classes.flex}>
        <StringRepresentationForm key={selectedNode.node} climateConceptId={selectedNode.node} string={selectedNode.label}/>
      </div>}
      {selectedEdge.length === 4 && last === 'edge' && <div className={classes.flex}>
        <div><StringRepresentationForm key={selectedEdge[0]} climateConceptId={selectedEdge[0]} string={selectedEdge[1]} type='Cause'/></div>
        <div><StringRepresentationForm key={selectedEdge[2]} climateConceptId={selectedEdge[2]} string={selectedEdge[3]} type='Effect'/></div>
      </div>}
    </div>
  );
};
