import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { useSigma } from "@react-sigma/core";

import { IIndexable, IValidatable, ValidatableUseCases } from "business-logic";
import useApiClient from "../../hooks/useApiClient";

interface Props {
  endpoint: '/climate-concept-nodes' | '/connections';
  object: IIndexable & IValidatable;
  type: 'node' | 'edge';
}

function ReviewCorrectionChips({ endpoint, object, type }: Props) {
  const apiClient = useApiClient();
  const sigma = useSigma();

  const [needsReview, setNeedsReview] = useState<boolean>();
  const [needsCorrection, setNeedsCorrection] = useState<boolean>();

  function handleReviewChipClicked() {
    if (!object) {
      return;
    }
    object.needsReview = !needsReview;
    setNeedsReview((prev) => !prev);

    apiClient.updateNeedsReviewLabel(object.id, object.needsReview, endpoint);
    const color = ValidatableUseCases.getColor(object, type)

    if (type === 'node') {
      sigma.getGraph().setNodeAttribute(object.id, 'color', color)
    } else if (type === 'edge') {
      sigma.getGraph().setEdgeAttribute(object.id, 'color', color)
    }
  }

  function handleCorrectionChipClicked() {
    if (!object) {
      return;
    }

    object.needsCorrection = !needsCorrection;
    setNeedsCorrection((prev) => !prev);

    apiClient.updateNeedsCorrectionLabel(object.id, object.needsCorrection, endpoint);
    const color = ValidatableUseCases.getColor(object, type)

    if (type === 'node') {
      sigma.getGraph().setNodeAttribute(object.id, 'color', color)
    } else if (type === 'edge') {
      sigma.getGraph().setEdgeAttribute(object.id, 'color', color)
    }
  }
  
  useEffect(() =>  {
    setNeedsReview(object.needsReview);
    setNeedsCorrection(object.needsCorrection);
  }, [object])
  
  return (
    <>
      <Chip
        label="Needs Review"
        size="small"
        onClick={handleReviewChipClicked}
        style={{
          marginBottom: 20,
          marginRight: '10px',
          background: needsReview ? '#006080' : '#eee',
          color: needsReview ? 'white' : 'black',
        }}
      />

      <Chip
        label="Needs Correction"
        size="small"
        onClick={handleCorrectionChipClicked}
        style={{
          marginBottom: 20,
          background: needsCorrection ? '#801a00' : '#eee',
          color: needsCorrection ? 'white' : 'black',
        }}
      />
    </>
  );
}

export default ReviewCorrectionChips;
