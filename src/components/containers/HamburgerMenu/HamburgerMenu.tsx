import * as React from 'react';
import { Fab, Menu, MenuProps } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

//#region Styled Menu
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
//#endregion

interface Props {
  children: React.ReactNode;
}

interface ChildProps {
  onClick: () => void;
}

function HamburgerMenu({ children }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  function onClick() {
    setAnchorEl(null);
  }
  
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onClick } as ChildProps);
    }
    return child;
  });
  
  return (
    <div style={{ position: 'absolute', right: 120, top: 10 }}>
      <Fab
        style={{ background: 'white' }}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MenuIcon />
      </Fab>

      <StyledMenu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {childrenWithProps}
      </StyledMenu>
    </div>
  );
}

export default HamburgerMenu;
