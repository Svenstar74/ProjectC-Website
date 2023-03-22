import { useWebSocket } from './hooks/useWebSocket';
import { useAppSelector } from './store/redux/hooks';
import { DisplayGraph } from './components/Graph/DisplayGraph';
import { NodeDetails } from './components/NodeDetails';
import { EdgeDetails } from './components/EdgeDetails';
import { HamburgerMenu } from './components/HamburgerMenu';
import { Toolbar } from './components/Toolbar';
import classes from './App.module.css';

function App() {
  useWebSocket();
  const last = useAppSelector((state) => state.graph.last);

  return (
    <>
      <div className={classes.graphView} onContextMenu={(e) => e.preventDefault()}>
        <DisplayGraph />
      </div>

      <div className={classes.nodeDetails}>
        {last === 'node' && <NodeDetails />}
        {last === 'edge' && <EdgeDetails />}
      </div>

      <div className={classes.hamburgerMenu}>
        <HamburgerMenu />
      </div>

      <div className={classes.toolbar}>
        <Toolbar />
      </div>
    </>
  );
}

export default App;
