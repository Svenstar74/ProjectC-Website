import classes from './App.module.css';
import { DetailsViewDrawer } from './DetailsView/DetailsViewDrawer';

import { DisplayGraph } from './GraphView/DisplayGraph';

function App() {  
  return (
    <div className={`"App" ${classes.App}`}>
      <div
        className={classes.graphView}
        onContextMenu={(e) => e.preventDefault()}
      >
        <DisplayGraph></DisplayGraph>
      </div>
      <div className={classes.detailsView}>
        <DetailsViewDrawer />
      </div>
    </div>
  );
}

export default App;
