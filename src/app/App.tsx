import classes from './App.module.css';
import { BottomDetailsView } from './views/BottomDetailsView/BottomDetailsView';
import { ContextMenu } from './components/ContextMenu';

import { DisplayGraph } from './views/GraphView/DisplayGraph';
import { useWebSocket } from './hooks/useWebSocket';
import { useAppDispatch, useAppSelector } from './store/redux/hooks';
import { hideContextMenu } from './store/redux/uiSlice';
import { HamburgerMenu } from './components/HamburgerMenu';
import { Toolbar } from './components/Toolbar';

function App() {  
  const dispatch = useAppDispatch();
  
  const showContextMenu = useAppSelector(state => state.ui.showContextMenu);
  const contextMenuOptions = useAppSelector(state => state.ui.contextMenuOptions);
  const contextMenuPosition = useAppSelector(state => state.ui.contextMenuPosition);
  const nodeToDelete = useAppSelector(state => state.ui.selectedNode);
  
  useWebSocket(); 

  return (
    <>
      <div className={classes.app} onClick={() => dispatch(hideContextMenu())} onContextMenu={(e) => e.preventDefault()}>
        <div className={classes.graphView}><DisplayGraph /></div>
        <div className={classes.bottomDetails}><BottomDetailsView /></div>        
        
        <ContextMenu show={showContextMenu} position={{x: contextMenuPosition[0], y: contextMenuPosition[1]}} menuItems={contextMenuOptions} clickedItemId={nodeToDelete}/>
      </div>

      <div className={classes.hamburgerMenu}><HamburgerMenu /></div>
      <div className={classes.toolbar}><Toolbar /></div>
    </>
  );
}

export default App;
