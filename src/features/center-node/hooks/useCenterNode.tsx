import { useCamera, useSigma } from '@react-sigma/core';
import { ClimateConceptUseCases } from 'business-logic';

function useCenterNode() {
  const sigma = useSigma();
  const { goto } = useCamera();

  function centerNode(nodeId: string) {
    sigma.getGraph().setNodeAttribute(nodeId, 'highlighted', true);

    const nodeDisplayData = sigma.getNodeDisplayData(nodeId);
    goto({ ...nodeDisplayData, ratio: 0.2 }, { duration: 1000 });
  }

  function centerNodeByName(name: string) {
    const standardizedName = ClimateConceptUseCases.standardizeName(name);

    const result = sigma.getGraph().findNode((nodeId) => {
      const nodeLabel = sigma.getGraph().getNodeAttribute(nodeId, 'label');
      return ClimateConceptUseCases.standardizeName(nodeLabel) === standardizedName;
    });

    if (result) {
      centerNode(result);
    }
  }

  return {
    centerNode,
    centerNodeByName,
  };
}

export default useCenterNode;
