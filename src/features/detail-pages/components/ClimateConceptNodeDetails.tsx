import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Collapse, IconButton, ListItemText, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSigma } from '@react-sigma/core';

import { IClimateConceptNode, IComment } from "business-logic";

import EditStringRepresentationDialog from "./EditStringRepresentationDialog";
import { Comments } from "./comments";
import { Sources } from "./sources";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import ReviewCorrectionChips from "./ReviewCorrectionChips";
import useApiClient from "../../../components/hooks/useApiClient";
import { useAppSelector } from "../../../store/redux/hooks";
import Paths from "./path/Paths";

interface Props {
  climateConceptId: string;
}

function ClimateConceptNodeDetails({ climateConceptId }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();
  const sigma = useSigma();
  
  const [expanded, setExpanded] = useState(true);
  const [climateConceptNode, setClimateConceptNode] = useState<IClimateConceptNode>();
  const [comments, setComments] = useState<IComment[]>([]);
  
  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Open the dialog to edit the string representation of a climate concept node
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  function onDeleteNode() {
    apiClient.deleteClimateConceptNode(climateConceptId);
    sigma.getGraph().dropNode(climateConceptId);
    setShowConfirmationModal(false);
  }

  function onRenameNode(newName: string) {
    setOpenEditDialog(false)
    sigma.getGraph().setNodeAttribute(climateConceptId, 'label', newName)
    setClimateConceptNode((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        name: newName,
      };
    });
  }

  useEffect(() => {
    apiClient.getClimateConceptNode(climateConceptId)
      .then((node) => {
        setClimateConceptNode(node);
        apiClient.getCommentsForReferenceId(climateConceptId)
          .then((comments) => {
            setComments(comments);
          })
      });
  }, [climateConceptId]);

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
                
                {isLoggedIn &&
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setOpenEditDialog(true);
                    }}
                  >
                    Edit String Representation
                  </MenuItem>
                }

                {isLoggedIn &&
                  <MenuItem onClick={() => setShowConfirmationModal(true)}>
                    Delete Node
                  </MenuItem>
                }
                
              </Menu>
            </>
          }
          title={climateConceptNode.name}
          titleTypographyProps={{ variant: 'body1' }}
          subheader={
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>ID {climateConceptId}</div>
              <div>Created by {climateConceptNode.createdBy} on {new Date(climateConceptNode.createdAt).toLocaleString()}</div>
            </div>
          }
          subheaderTypographyProps={{ variant: 'body2' }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ReviewCorrectionChips endpoint='/climate-concept-nodes' object={climateConceptNode} type='node' />

            <Paths id={climateConceptId} />
            <Comments id={climateConceptId} comments={comments} />
            <Sources endpoint='/climate-concept-nodes' id={climateConceptId} sources={climateConceptNode.sources} />
          </CardContent>
        </Collapse>
      </Card>

      <EditStringRepresentationDialog
        open={openEditDialog}
        onClose={onRenameNode}
        climateConceptId={climateConceptId}
        current={climateConceptNode.name}
      />

      <ConfirmDialog
        open={showConfirmationModal}
        onConfirm={onDeleteNode}
        onCancel={() => setShowConfirmationModal(false)}
        title="Delete Node"
        content="Are you sure you want to delete this node? This action cannot be undone."
      />
    </>
  );
}

export default ClimateConceptNodeDetails;
