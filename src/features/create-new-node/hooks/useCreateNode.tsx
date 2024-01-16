import { useSigma } from '@react-sigma/core';
import { ValidatableUseCases } from 'business-logic';

import { IPostClimateConceptNodeRequest, postClimateConceptNode } from '../api';

function useCreateNode() {
  const sigma = useSigma();

  async function createNode(data: IPostClimateConceptNodeRequest) {
    const response = await postClimateConceptNode(data);

    const node = response.data;
    const color = ValidatableUseCases.getColor(node, 'node');

    sigma.getGraph().addNode(node.id, {
      x: node.x,
      y: node.y,
      size: 2,
      label: node.name,
      forceLabel: true,
      color: color,
    });

    sigma.refresh();

    return response;
  }

  return {
    createNode,
  };
}

export default useCreateNode;
