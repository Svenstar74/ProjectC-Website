import React, { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { Paper } from '@mui/material';
import { useAppSelector } from '../../../store/redux/hooks';

interface Props {
  children: React.ReactNode;
}

interface ChildProps {
  hoveredNode: null | string;
  hideQab: (timeout?: number) => void;
}

function GraphEvents({ children }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [showQab, setShowQab] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<null | string>(null);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const [nodeIsMoving, setNodeIsMoving] = useState(false);

  function hideQab(timeout=500) {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }

    setHideTimeout(setTimeout(() => {
      setShowQab(false);
    }, timeout)); // Adjust the delay time (in milliseconds) as needed
  }

  function updateQabPosition(hoveredNode: string) {
    if (hoveredNode !== '') {
      const x = sigma.getGraph().getNodeAttribute(hoveredNode, 'x');
      const y = sigma.getGraph().getNodeAttribute(hoveredNode, 'y');

      const pos = sigma.graphToViewport({ x, y });

      setXPos(pos.x);
      setYPos(pos.y + 10);
    }
  }

  useEffect(() => {
    function onDeleteNode(e: any) {
      setShowQab(false);
    }

    sigma.getGraph().on('nodeDropped', onDeleteNode);

    return () => {
      sigma.getGraph().off('nodeDropped', onDeleteNode);
    };
  }, [sigma]);

  useEffect(() => {
    registerEvents({
      enterNode(e) {
        if (isNaN(+e.node)) return;

        if (sigma.getCamera().ratio < 0.37) {
          updateQabPosition(e.node);
          setHoveredNode(e.node);
          clearTimeout(hideTimeout);
          setShowQab(true);
        }
      },
      leaveNode() {
        hideQab();
      },
      downNode() {
        setNodeIsMoving(true);
      },
      mouseup() {
        setNodeIsMoving(false);
      },
      clickEdge() {
        hideQab();
      },
      clickStage() {
        setShowQab(false);
      },
      updated() {
        setShowQab(false);
      },
    });
  }, [sigma, registerEvents, hoveredNode, hideTimeout]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { hoveredNode, hideQab } as ChildProps);
    }
    return child;
  });

  if (nodeIsMoving) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: xPos,
          top: yPos,
          opacity: showQab ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: showQab ? 'auto' : 'none',
        }}
      >
        <Paper
          elevation={3}
          style={{ padding: '10px', position: 'relative' }}
          onMouseEnter={() => clearTimeout(hideTimeout)}
          onMouseLeave={() => hideQab()}
        >
          {childrenWithProps}
        </Paper>
      </div>
    </>
  );
}

export default GraphEvents;
