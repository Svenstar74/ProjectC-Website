import { useAppSelector } from '../store/hooks';
import classes from './DetailsViewDrawer.module.css';

export const DetailsViewDrawer = () => {
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);

  return (
    <div className={classes.container}>
      <div className={classes.header}>NODE ATTRIBUTES</div>
      <div className={classes.content}>
        {selectedNode && (
          <div>
            <p>Node name: &emsp; {selectedNode.label}</p>
            <p>
              x: {selectedNode.x.toFixed(2)} &emsp; y:{' '}
              {selectedNode.y.toFixed(2)} &emsp; size: {selectedNode.size}
            </p>
            <p></p>
          </div>
        )}
      </div>
    </div>
  );
};
