import { useSigma } from '@react-sigma/core';
import { useMutation } from '@tanstack/react-query';
import { IClimateConceptNode, ValidatableUseCases } from 'business-logic';

import { IPostClimateConceptNodeRequest, postClimateConceptNode } from '../api';
import { IApiResponse } from '../../../services/api-service/IApiResponse';


function useCreateNode() {
  const sigma = useSigma();

  // useMutation<TSuccessData, TErrorData, TRequestData>	
  const mutation = useMutation<IApiResponse<IClimateConceptNode>, IApiResponse<null>, IPostClimateConceptNodeRequest>({
    mutationFn: postClimateConceptNode,
    onSuccess(response) {
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
    },
  });

  return {
    createNode: mutation.mutate,
    ...mutation,
  };
}

export default useCreateNode;
