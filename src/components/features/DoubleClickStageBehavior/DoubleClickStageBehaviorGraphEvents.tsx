import { useEffect } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';

function GraphEvents() {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      doubleClickNode(e) {
        e.preventSigmaDefault();
      },
      doubleClickStage(e) {
        e.preventSigmaDefault();
      },
    });
  }, [sigma, registerEvents]);

  return null;
}

export default GraphEvents;
