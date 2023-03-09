import classes from './App.module.css';
import { BottomDetailsView } from './BottomDetailsView/BottomDetailsView';

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
      <div className={classes.bottomDetails}>
        <BottomDetailsView />
      </div>
    </div>
  );
}

export default App;
