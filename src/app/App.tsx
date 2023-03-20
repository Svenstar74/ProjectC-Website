import classes from './App.module.css';
import { BottomDetailsView } from './views/BottomDetailsView/BottomDetailsView';

import { DisplayGraph } from './views/GraphView/DisplayGraph';
import { useWebSocket } from './hooks/useWebSocket';
import { HamburgerMenu } from './components/HamburgerMenu';
import { Toolbar } from './components/Toolbar';
import { NodeDetails } from './components/NodeDetails';

function App() {
  useWebSocket();

  return (
    <>
      <div className={classes.app} onContextMenu={(e) => e.preventDefault()}>
        <div className={classes.graphView}><DisplayGraph /></div>
        <div className={classes.bottomDetails}><BottomDetailsView /></div>        
      </div>

      <div className={classes.nodeDetails}><NodeDetails /></div>

      <div className={classes.hamburgerMenu}><HamburgerMenu /></div>
      <div className={classes.toolbar}><Toolbar /></div>
    </>
  );
}

export default App;
