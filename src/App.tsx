import classes from './App.module.css';
import useWebSocket from './hooks/useWebSocket';
import { useAppSelector } from './store/redux/hooks';
import useInitGraph from './hooks/useInitGraph';

import ClimateConceptNodeDetails from './components/details/ClimateConceptNodeDetails';
import SummaryNodeDetails from './components/details/SummaryNodeDetails';
import EdgeDetails from './components/details/EdgeDetails';

import { DisplayGraph } from './components/graph/DisplayGraph';
import HamburgerMenu from './components/HamburgerMenu';
import Viewbar from './components/Viewbar';
import Toolbar from './components/Toolbar';

function App() {
  useInitGraph();
  useWebSocket();
  const lastSelected = useAppSelector(state => state.graph.lastSelected);

  return (
    <div className="App" onContextMenu={(e) => e.preventDefault()}>

      <div className={classes.graphView}>
        <DisplayGraph />
      </div>

      <div className={classes.details}>
        {lastSelected === 'ClimateConceptNode' && <ClimateConceptNodeDetails />}
        {lastSelected === 'SummaryNode' && <SummaryNodeDetails />}
        {lastSelected === 'Edge' && <EdgeDetails />}
      </div>

      <div className={classes.hamburgerMenu}>
        <HamburgerMenu />
      </div>
      
      <div className={classes.viewBar}>
        <Viewbar />
      </div>

      <div className={classes.toolbar}>
        <Toolbar />
      </div>
      
    </div>
  )
}

export default App
