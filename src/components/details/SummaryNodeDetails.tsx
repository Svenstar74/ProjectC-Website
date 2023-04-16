import { useContext, useEffect, useState } from "react";
import { Autocomplete, Card, CardContent, CardHeader, Collapse, IconButton, List, ListItem, ListItemText, Menu, MenuItem, TextField, Tooltip } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import useApiClient from "../../hooks/useApiClient";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { AppContext } from "../../store/context/AppContext";
import UpdateSummaryNodeNameDialog from "../dialogs/UpdateSummaryNodeNameDialog";
import { addCombinedNode, removeCombinedNode } from "../../store/redux/slices/dataSlice";

function SummaryNodeDetails() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { globalSigmaInstance } = useContext(AppContext);
  
  const summaryNodesVisible = useAppSelector(state => state.tool.summaryNodesVisible);
  
  const [expanded, setExpanded] = useState(true);

  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  
  // Open the dialog to edit the name of a summary node
  const [openEditDialog, setOpenEditDialog] = useState(false);

  //#region Get the climate concept nodes for the combined nodes id
  const allClimateConceptNodes = useAppSelector(state => state.data.allClimateConceptNodes);
  
  function getClimateConceptNodeById(id: string) {
    const result = allClimateConceptNodes.find(node => node.climateConcept.id === id);
    if (!result) {
      throw new Error(`Could not find climate concept node in array of combined nodes [id: ${id}]`)
    }

    return result;
  }
  //#endregion
  
  function removeClimateConceptNode(id: string) {
    if (!summaryNode) {
      return;
    }
    
    apiClient.removeConceptsFromSummaryNode(summaryNode.id, [id])
    dispatch(removeCombinedNode({ summaryNodeId: summaryNode.id, climateConceptNodeId: id }));
    // Hide ClimateConceptNode
    globalSigmaInstance?.getGraph().setNodeAttribute(id, 'hidden', false);
    
    // Remove SummaryNode if it was the last combined node
    if (summaryNode.combinedNodes.length === 1) {
      apiClient.deleteSummaryNode(summaryNode.id);
    }
  }

  const [newCombinedNodeName, setNewCombinedNodeName] = useState<string| null>(null);
  const [stringRepresentations, setStringRepresentations] = useState<string[]>([]);
  function addClimateConceptNode() {
    if (!summaryNode || !newCombinedNodeName) {
      return;
    }

    const climateConceptNode = allClimateConceptNodes.find(node => node.climateConcept.stringRepresentation === newCombinedNodeName);
    if (!climateConceptNode) {
      return;
    }
    
    apiClient.addConceptsToSummaryNode(summaryNode.id, [climateConceptNode.climateConcept.id]);
    setNewCombinedNodeName(null);

    if (summaryNodesVisible) {
      globalSigmaInstance?.getGraph().setNodeAttribute(climateConceptNode.climateConcept.id, 'hidden', true);
    }
  }
  
  // Get the node attributes
  const selectedNode = useAppSelector(state => state.graph.selectedNode);
  const summaryNode = useAppSelector((state) => state.data.allSummaryNodes.find(node => node.id === selectedNode));
  
  // Get the autocomplete data
  useEffect(() => {
    const filtered = allClimateConceptNodes.filter(node => !summaryNode?.combinedNodes.includes(node.climateConcept.id));
    const mapped = filtered.map(node => node.climateConcept.stringRepresentation);
    setStringRepresentations(mapped);
  }, [allClimateConceptNodes, summaryNode]);

  if (!summaryNode) {
    return null;
  }
  
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
                  Change Name
                </MenuItem>
              </Menu>
            </>
          }
          title={summaryNode.name}
          titleTypographyProps={{ variant: 'body1' }}
          subheader={`ID ${selectedNode}`}
          subheaderTypographyProps={{ variant: 'body2' }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>

            <Card>
              {/* List of combined nodes */}
              <List>
                {summaryNode.combinedNodes.map(id => (
                  <ListItem
                    key={id}
                    secondaryAction={
                      <Tooltip title="Remove from the Summary Node">
                        <IconButton edge="end" aria-label="delete" onClick={() => removeClimateConceptNode(id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText>{getClimateConceptNodeById(id).climateConcept.stringRepresentation}</ListItemText>
                  </ListItem>
                ))}
              </List>

              {/* Add new combined node */}
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', margin: '20px 10px' }}>
                <Autocomplete
                  key={summaryNode.combinedNodes.length}
                  options={stringRepresentations}
                  autoHighlight
                  renderInput={(params) => (
                    <TextField {...params} variant='outlined' label='Add new Node' />
                  )}
                  onChange={(event, value) => setNewCombinedNodeName(value)}
                  style={{ width: '80%' }}
                />

                <Tooltip title="Add to Summary Node">
                  <IconButton style={{height: 40}} onClick={addClimateConceptNode} >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Card>

          </CardContent>
        </Collapse>
      </Card>

      <UpdateSummaryNodeNameDialog
        open={openEditDialog}
        id={selectedNode}
        currentName={summaryNode.name}
        onClose={() => setOpenEditDialog(false)}
      />
    </>
  );
}

export default SummaryNodeDetails;
