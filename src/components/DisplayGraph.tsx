import '@react-sigma/core/lib/react-sigma.min.css';
import { ControlsContainer, FullScreenControl, SigmaContainer, ZoomControl } from '@react-sigma/core';

import LoadGraphFromMongoDb from './features/LoadGraphFromMongoDb/LoadGraphFromMongoDb';

// import HamburgerMenu from './containers/HamburgerMenu/HamburgerMenu';
import QuickAccessBar from './containers/QuickAccessBar/GraphEvents';

import RightClickStage from './features/RightClickStage/GraphEvents';
import RightClickEdge from './features/RightClickEdge/GraphEvents';

import DragAndDrop from './features/DragAndDrop/DragAndDropGraphEvents';
import ResponsiveLabelSize from './features/ResponsiveLabelSize/GraphEvents';
import DoubleClickStageBehavior from './features/DoubleClickStageBehavior/DoubleClickStageBehaviorGraphEvents';
import AddConnection from './features/AddConnection/AddConnectionGraphEvents';
import DetailPages from './features/DetailPages/DetailPagesGraphEvents';
import Searchbar from './features/Searchbar/Searchbar';
import ToggleViewOfNodes from './features/ToggleViewOfNodes/ToggleViewOfNodes';
import AddConnectionSnackbar from './features/AddConnection/AddConnectionSnackbar';
import ToggleViewEdgeTypes from './features/ToggleViewEdgeTypes/ToggleViewButtons';
import LoginIcon from './features/LoginIcon/LoginIcon';
import SelectToolGraphEvents from './features/SelectTool/SelectToolGraphEvents';
// import GetHelpButton from './features/GetHelpButton/GetHelpButton';

function DisplayGraph() {  
  //#region Fullscreen handling
  // const [isFullscreen, setIsFullscreen] = useState(false);

  // useEffect(() => {
  //   const handleFullscreenChange = () => {
  //     setIsFullscreen(Boolean(
  //       document.fullscreenElement
  //     ));
  //   };

  //   document.addEventListener('fullscreenchange', handleFullscreenChange);
  //   document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  //   return () => {
  //     document.removeEventListener('fullscreenchange', handleFullscreenChange);
  //     document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  //   };
  // }, []);
  //#endregion
  
  return (
    <SigmaContainer
      settings={{
        defaultEdgeType: 'arrow',
        labelSize: 2.5,
      }}
      style={{ width: '100vw', height: '100vh', backgroundColor: '#eee' }}
    >      
      <ControlsContainer position="top-right">
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>

      <LoadGraphFromMongoDb />
      
      <QuickAccessBar>
        <AddConnection hoveredNode='' hideQab={() => {}} />
      </QuickAccessBar>

      <AddConnectionSnackbar />
      
      <LoginIcon />
      
      <ResponsiveLabelSize />
      <DoubleClickStageBehavior />

      <DragAndDrop />

      <ToggleViewEdgeTypes />
      <ToggleViewOfNodes />
      <DetailPages />
      
      <SelectToolGraphEvents />
      
      <RightClickStage />
      <RightClickEdge />

      <ControlsContainer position="bottom-right" style={{ border: 'none' }}>
        <Searchbar />
      </ControlsContainer>
      
      {/* {!isFullscreen && (
        <HamburgerMenu>
          <DownloadGraphAsCsv onClick={() => {}} />
        </HamburgerMenu>
      )} */}

      {/* <GetHelpButton /> */}

    </SigmaContainer>
  );
}

export default DisplayGraph;
