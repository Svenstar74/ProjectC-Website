import { useEffect, useState } from "react";
import { Card, CardHeader, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { validate } from "uuid";

import { useAppSelector } from "../../store/redux/hooks";
import EditStringRepresentationDialog from "../dialogs/EditStringRepresentationDialog";
import UpdateSummaryNodeNameDialog from "../dialogs/UpdateSummaryNodeNameDialog";

function EdgeDetails() {
  const [expanded, setExpanded] = useState(false);
  
  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Open the dialog to edit the string representation for one of the climate concept nodes
  const [openEditDialogSource, setOpenEditDialogSource] = useState(false);
  const [openEditDialogTarget, setOpenEditDialogTarget] = useState(false);
  const [sourceType, setSourceType] = useState<'ClimateConcept' | 'Summary'>('Summary');
  const [targetType, setTargetType] = useState<'ClimateConcept' | 'Summary'>('Summary');

  //#region Get the edge data and the information about the climate concept / summary nodes
  const selectedEdge = useAppSelector(state => state.graph.selectedEdge);
  const sourceClimateConceptNode = useAppSelector(state => state.data.allClimateConceptNodes.find(node => node.climateConcept.id === selectedEdge[0]));
  const targetClimateConceptNode = useAppSelector(state => state.data.allClimateConceptNodes.find(node => node.climateConcept.id === selectedEdge[1]));
  const sourceSummaryNode = useAppSelector(state => state.data.allSummaryNodes.find(node => node.id === selectedEdge[0]));
  const targetSummaryNode = useAppSelector(state => state.data.allSummaryNodes.find(node => node.id === selectedEdge[1]));

  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');

  const [sourceName, setSourceName] = useState('');
  const [targetName, setTargetName] = useState('');

  useEffect(() => {
    if (validate(selectedEdge[0])) {
      setSourceId(sourceSummaryNode ? sourceSummaryNode.id : '');
      setSourceName(sourceSummaryNode ? sourceSummaryNode.name : '');
      setSourceType('Summary');
    } else {
      setSourceId(sourceClimateConceptNode ? sourceClimateConceptNode.climateConcept.id : '');
      setSourceName(sourceClimateConceptNode ? sourceClimateConceptNode.climateConcept.stringRepresentation : '');
      setSourceType('ClimateConcept');
    }

    if (validate(selectedEdge[1])) {
      setTargetId(targetSummaryNode ? targetSummaryNode.id : '');
      setTargetName(targetSummaryNode ? targetSummaryNode.name : '');
      setTargetType('Summary');
    } else {
      setTargetId(targetClimateConceptNode ? targetClimateConceptNode.climateConcept.id : '');
      setTargetName(targetClimateConceptNode ? targetClimateConceptNode.climateConcept.stringRepresentation : '');
      setTargetType('ClimateConcept');
    }
  }, [selectedEdge, openEditDialogSource, openEditDialogTarget]);
  //#endregion
  
  return (
    <>
      <Card
        style={{ overflowY: expanded ? 'scroll' : 'hidden' }}
        sx={{ width: 550, maxHeight: '100vh' }}
      >
        <CardHeader
          action={
            <>
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                style={{ top: '-4px' }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setOpenEditDialogSource(true);
                  }}
                >
                  {sourceType === 'ClimateConcept' ? 'Edit String Representation (Cause)' : 'Edit Name (Cause)'}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setOpenEditDialogTarget(true);
                  }}
                >
                  {targetType === 'ClimateConcept' ? 'Edit String Representation (Effect)' : 'Edit Name (Effect)'}
                </MenuItem>
              </Menu>
            </>
          }
          title={
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr' }}>
              <div>
                <b>Cause</b>
              </div>
              <div>{sourceName}</div>
              <div>
                <b>Effect</b>
              </div>
              <div>{targetName}</div>
            </div>
          }
          titleTypographyProps={{ variant: 'body1' }}
          subheader={
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div>Cause ID: {sourceId} &ensp;</div>
              <div>Effect ID: {targetId}</div>
            </div>
          }
          subheaderTypographyProps={{ variant: 'body2' }}
        />
      </Card>

      {sourceType === 'Summary' && <UpdateSummaryNodeNameDialog
        open={openEditDialogSource}
        id={sourceId}
        currentName={sourceName}
        onClose={() => setOpenEditDialogSource(false)}
      />}
      {sourceType === 'ClimateConcept' && <EditStringRepresentationDialog
        open={openEditDialogSource}
        onClose={() => setOpenEditDialogSource(false)}
        climateConceptId={sourceId}
        current={sourceName}
      />}

      {targetType === 'Summary' && <UpdateSummaryNodeNameDialog
        open={openEditDialogTarget}
        id={targetId}
        currentName={targetName}
        onClose={() => setOpenEditDialogTarget(false)}
      />}
      {targetType === 'ClimateConcept' && <EditStringRepresentationDialog
        open={openEditDialogTarget}
        onClose={() => setOpenEditDialogTarget(false)}
        climateConceptId={targetId}
        current={targetName}
      />}


      {/* {sourceName && targetName && <EditStringRepresentationDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        climateConceptId={sourceOrTarget === 'source' ? sourceId : targetId }
        current={sourceOrTarget === 'source' ? sourceName : targetName }
      />} */}
    </>
  );
}

export default EdgeDetails;
