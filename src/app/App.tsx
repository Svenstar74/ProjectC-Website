import classes from './App.module.css';
import { BottomDetailsView } from './BottomDetailsView/BottomDetailsView';
import { ContextMenu } from './components/ContextMenu';
import { DelEdgeDialog } from './components/DelEdgeDialog';
import { NewEdgeDialog } from './components/NewEdgeDialog';
import { NewNodeDialog } from './components/NewNodeDialog';
import { DetailsViewDrawer } from './DetailsView/DetailsViewDrawer';

import { DisplayGraph } from './GraphView/DisplayGraph';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { hideContextMenu } from './store/uiSlice';

function App() {  
  const dispatch = useAppDispatch();
  const showNewNodeDialog = useAppSelector((state) => state.ui.showNewNodeDialog);
  const showNewEdgeDialog = useAppSelector((state) => state.ui.showNewEdgeDialog);
  const showDelEdgeDialog = useAppSelector((state) => state.ui.showDelEdgeDialog);
  
  const handleClickWebsite = () => {
    dispatch(hideContextMenu())
  }
  
  return (
    <div className={`"App" ${classes.App}`} onClick={handleClickWebsite}>
      <div
        className={classes.graphView}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ContextMenu />
        <DisplayGraph></DisplayGraph>
      </div>
      <div className={classes.bottomDetails}>
        <BottomDetailsView />
      </div>
      {/* <div className={classes.detailsView}>
        <DetailsViewDrawer />
      </div> */}
      
      <NewNodeDialog open={showNewNodeDialog} />
      <NewEdgeDialog open={showNewEdgeDialog} />
      <DelEdgeDialog open={showDelEdgeDialog} />
    </div>
  );
}

export default App;
