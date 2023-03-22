import { useWebSocket } from './hooks/useWebSocket';
import { DisplayGraph } from './components/Graph/DisplayGraph';
import { NodeDetails } from './components/NodeDetails';
import { HamburgerMenu } from './components/HamburgerMenu';
import { Toolbar } from './components/Toolbar';
import classes from './App.module.css';

function App() {
  useWebSocket();

  return (
    <>
      <div className={classes.graphView} onContextMenu={(e) => e.preventDefault()}>
        <DisplayGraph />
      </div>

      <div className={classes.nodeDetails}>
        <NodeDetails />
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
