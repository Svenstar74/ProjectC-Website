import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

function IconToolbarItem({ icon, tooltip, onClick, style }: Props) {
  return (
    <Tooltip title={tooltip}>
      <IconButton size='small' onClick={onClick} style={{ padding: 0, ...style }}>
        {React.cloneElement(icon as React.ReactElement, { fontSize: 'small' })}
      </IconButton>
    </Tooltip>
  );
}

export default IconToolbarItem;
