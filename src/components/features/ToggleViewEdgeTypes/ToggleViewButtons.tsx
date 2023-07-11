import { useSigma } from "@react-sigma/core";
import { Fab, Tooltip } from "@mui/material";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { useAppDispatch, useAppSelector } from "../../../store/redux/hooks";
import { setContributesToVisible, setIsAVisible, setIsEqualToVisible } from "../../../store/redux/slices/graphSlice";

function ToggleViewButtons() {
  const { contributesToVisible, isAVisible, isEqualToVisible } = useAppSelector(state => state.graph);
  const dispatch = useAppDispatch();
  const sigma = useSigma();

  function toggleContributesTo() {    
    sigma.getGraph().edges().forEach(edge => {
      const edgeType = sigma.getGraph().getEdgeAttribute(edge, 'connectionType');
      
      if (edgeType === 'contributesTo') {
        sigma.getGraph().setEdgeAttribute(edge, 'hidden', contributesToVisible);
      }
    });
    
    dispatch(setContributesToVisible(!contributesToVisible));
  }

  function toggleIsA() {
    sigma.getGraph().edges().forEach(edge => {
      const edgeType = sigma.getGraph().getEdgeAttribute(edge, 'connectionType');

      if (edgeType === 'isA') {
        sigma.getGraph().setEdgeAttribute(edge, 'hidden', isAVisible);
      }
    });
    
    dispatch(setIsAVisible(!isAVisible));
  }

  function toggleIsEqualTo() {
    sigma.getGraph().edges().forEach(edge => {
      const edgeType = sigma.getGraph().getEdgeAttribute(edge, 'connectionType');

      if (edgeType === 'isEqualTo') {
        sigma.getGraph().setEdgeAttribute(edge, 'hidden', isEqualToVisible);
      }
    });
    
    dispatch(setIsEqualToVisible(!isEqualToVisible));
  }
  
  return (
    <div style={{ position: 'absolute', top: 20, right: 260 }}>
      <Tooltip title={contributesToVisible ? "Hide contributesTo Connections" : "Show contributesTo Connections"}>
        <Fab size="small" onClick={toggleContributesTo} style={{ marginRight: 10, backgroundColor: contributesToVisible ? 'white' : 'gray' }}>
          <ArrowRightAltIcon />
        </Fab>
      </Tooltip>

      <Tooltip title={isAVisible ? "Hide isA Connections" : "Show isA Connections"}>
        <Fab size="small" onClick={toggleIsA}  style={{ marginRight: 10, backgroundColor: isAVisible ? 'white' : 'gray' }}>
          <ArrowRightAltIcon />
        </Fab>
      </Tooltip>

      <Tooltip title={isEqualToVisible ? "Hide isEqualTo Connections" : "Show isEqualTo Connections"}>
        <Fab size="small" onClick={toggleIsEqualTo}  style={{ marginRight: 10, backgroundColor: isEqualToVisible ? 'white' : 'gray' }}>
          <SyncAltIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

export default ToggleViewButtons;
