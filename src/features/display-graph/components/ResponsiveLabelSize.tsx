import { useEffect } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';

function GraphEvents() {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      updated(e) {
        sigma.setSetting('labelSize', Math.min(2.5 / e.ratio, 30));
      },
    });
  }, [sigma, registerEvents]);

  return null;
}

export default GraphEvents;
