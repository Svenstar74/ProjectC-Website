import { useState } from 'react';
import { Card, CardContent, CardHeader, Collapse, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAppSelector } from '../store/redux/hooks';
import { EditStringRepresentationDialog } from './EditStringRepresentationDialog';

export const EdgeDetails = () => {
  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Edit string representation dialog
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [climateConceptId, setClimateConceptId] = useState<string>();
  const [stringRepresentation, setStringRepresentation] = useState<string>();

  // If the full card is shown or not
  // eslint-disable-next-line
  const [expanded, setExpanded] = useState(false);

  // Information about the current edge
  const selectedEdge = useAppSelector((state) => state.graph.selectedEdge);

  if (selectedEdge.length === 0) {
    return null;
  }

  return (
    <>
      <Card sx={{ width: 'fit-content', maxHeight: '100vh' }}>
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
                open={open}
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
                {/* <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setExpanded((prev) => !prev);
                    }}
                  >
                    <ListItemText>
                      {expanded ? 'Hide Details' : 'Show Details'}
                    </ListItemText>
                  </MenuItem> */}
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setClimateConceptId(selectedEdge[0]);
                    setStringRepresentation(selectedEdge[1]);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit String Representation (Cause)
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setClimateConceptId(selectedEdge[2]);
                    setStringRepresentation(selectedEdge[3]);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit String Representation (Effect)
                </MenuItem>
              </Menu>
            </>
          }
          title={
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr' }}>
              <div>
                <b>Cause</b>
              </div>
              <div>{selectedEdge[1]}</div>
              <div>
                <b>Effect</b>
              </div>
              <div>{selectedEdge[3]}</div>
            </div>
          }
          titleTypographyProps={{ variant: 'body1' }}
          subheader={
            <>
              Cause ID: {selectedEdge[0]} &ensp; Effect ID: {selectedEdge[2]}
            </>
          }
          subheaderTypographyProps={{ variant: 'body2' }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent></CardContent>
        </Collapse>
      </Card>

      {climateConceptId && stringRepresentation && (
        <EditStringRepresentationDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          climateConceptId={climateConceptId}
          current={stringRepresentation}
          id={selectedEdge.indexOf(stringRepresentation)}
        />
      )}
    </>
  );
};
