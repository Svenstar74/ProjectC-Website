import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface Props {
  open: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onCreateNodeSelected: () => void;
}

function ContextMenu({ open, position, onClose, onCreateNodeSelected }: Props) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference='anchorPosition'
      anchorPosition={{
        top: position.y,
        left: position.x,
      }}
    >
      <MenuItem onClick={onCreateNodeSelected}>
        <ListItemIcon>
          <AddCircleOutlineIcon fontSize='small' />
        </ListItemIcon>
        <ListItemText>Create New Node</ListItemText>
      </MenuItem>
    </Menu>
  );
}

export default ContextMenu;
