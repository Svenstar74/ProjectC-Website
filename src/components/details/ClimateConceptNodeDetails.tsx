import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Chip, Collapse, IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAppSelector } from "../../store/redux/hooks";
import { AppContext } from "../../store/context/AppContext";
import EditStringRepresentationDialog from "../dialogs/EditStringRepresentationDialog";
import Sources from "../Sources";
import useApiClient from "../../hooks/useApiClient";

function ClimateConceptNodeDetails() {
  const apiClient = useApiClient();
  const [expanded, setExpanded] = useState(true);
  
  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Open the dialog to edit the string representation of a climate concept node
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  // Get the node attributes
  const selectedNode = useAppSelector(state => state.graph.selectedNode);
  const climateConceptNode = useAppSelector((state) => state.data.allClimateConceptNodes.find(node => node.climateConcept.id === selectedNode));

  //#region For the chip labels
  const [needsReview, setNeedsReview] = useState(false);
  const [needsCorrection, setNeedsCorrection] = useState(false);
  
  const handleReviewChipClicked = () => {
    if (!climateConceptNode) {
      return;
    }

    apiClient.updateClimateConceptNodeLabel(climateConceptNode.climateConcept.id, 'NeedsReview', !needsReview);
    setNeedsReview((prev) => !prev);
  };

  const handleCorrectionChipClicked = () => {
    if (!climateConceptNode) {
      return;
    }

    apiClient.updateClimateConceptNodeLabel(climateConceptNode.climateConcept.id, 'NeedsCorrection', !needsCorrection);
    setNeedsCorrection((prev) => !prev);
  };

  useEffect(() => {
    if (climateConceptNode) {
      setNeedsReview(climateConceptNode.needsReview);
      setNeedsCorrection(climateConceptNode.needsCorrection);
    }
  }, [climateConceptNode])
  //#endregion
  
  if (!climateConceptNode) {
    return null;
  }

  // Return the actual component
  return (
    <>
      <Card
        style={{ overflowY: expanded ? 'scroll' : 'hidden' }}
        sx={{ width: '500px', maxHeight: '100vh' }}
      >
        <CardHeader
          style={{ overflow: 'auto' }}
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
                    setExpanded((prev) => !prev);
                  }}
                >
                  <ListItemText>
                    {expanded ? 'Hide Details' : 'Show Details'}
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit String Representation
                </MenuItem>
              </Menu>
            </>
          }
          title={climateConceptNode.climateConcept.stringRepresentation}
          titleTypographyProps={{ variant: 'body1' }}
          subheader={`ID ${selectedNode}`}
          subheaderTypographyProps={{ variant: 'body2' }}
        />
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Chip
              label="Needs Review"
              size="small"
              onClick={handleReviewChipClicked}
              style={{
                marginBottom: '25px',
                marginRight: '10px',
                background: needsReview ? '#006080' : '#eee',
                color: needsReview ? 'white' : 'black',
              }}
            />

            <Chip
              label="Needs Correction"
              size="small"
              onClick={handleCorrectionChipClicked}
              style={{
                marginBottom: '25px',
                background: needsCorrection ? '#801a00' : '#eee',
                color: needsCorrection ? 'white' : 'black',
              }}
            />
            
            <Sources climateConceptId={selectedNode} sources={climateConceptNode.climateConcept.sources} />
          </CardContent>
        </Collapse>
      </Card>

      <EditStringRepresentationDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        climateConceptId={selectedNode}
        current={climateConceptNode.climateConcept.stringRepresentation}
      />
    </>
  );
}

export default ClimateConceptNodeDetails;
