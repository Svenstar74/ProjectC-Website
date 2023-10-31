
import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';

import ContextMenu from './ContextMenu';
import CreateNodeDialog from './CreateNodeDialog';

function GraphEvents() {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const [showCreateNodeDialog, setShowCreateNodeDialog] = useState(false);

  function createNodeSelectedHandler() {
    setShowContextMenu(false);
    setShowCreateNodeDialog(true);
  }

  useEffect(() => {
    registerEvents({
      rightClickStage: (e) => {
        setShowContextMenu(true);
        setContextMenuPosition({ x: e.event.x, y: e.event.y });
      },
    });
  }, [sigma, registerEvents]);

  useEffect(() => {
    // Disable showing the default context menu on right click
    sigma.getContainer().addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }, [sigma]);

  return (
    <>
      <ContextMenu
        open={showContextMenu}
        position={contextMenuPosition}
        onClose={() => setShowContextMenu(false)}
        onCreateNodeSelected={createNodeSelectedHandler}
      />

      <CreateNodeDialog
        open={showCreateNodeDialog}
        clickPosition={contextMenuPosition}
        onClose={() => setShowCreateNodeDialog(false)}
      />
    </>
  );
}

export default GraphEvents;
