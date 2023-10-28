import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { useSigma } from "@react-sigma/core";

import { IIndexable, IValidatable, ValidatableUseCases } from "business-logic";
import useApiClient from "../../../components/hooks/useApiClient";
import { useAppSelector } from "../../../store/redux/hooks";

interface Props {
  endpoint: '/climate-concept-nodes' | '/connections';
  object: IIndexable & IValidatable;
  type: 'node' | 'connection';
}

function ReviewCorrectionChips({ endpoint, object, type }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();
  const sigma = useSigma();

  const [needsReview, setNeedsReview] = useState<boolean>();
  const [needsCorrection, setNeedsCorrection] = useState<boolean>();
  const [isReviewed, setIsReviewed] = useState<boolean>();

  function handleNeedsReviewChipClicked() {
    if (!object || !isLoggedIn) {
      return;
    }
    object.needsReview = !needsReview;
    setNeedsReview((prev) => !prev);

    apiClient.updateNeedsReviewLabel(object.id, object.needsReview, endpoint);
    const color = ValidatableUseCases.getColor(object, type)

    if (type === 'node') {
      sigma.getGraph().setNodeAttribute(object.id, 'color', color)
    } else if (type === 'connection') {
      sigma.getGraph().setEdgeAttribute(object.id, 'color', color)
    }
  }

  function handleNeedsCorrectionChipClicked() {
    if (!object || !isLoggedIn) {
      return;
    }

    object.needsCorrection = !needsCorrection;
    setNeedsCorrection((prev) => !prev);

    apiClient.updateNeedsCorrectionLabel(object.id, object.needsCorrection, endpoint);
    const color = ValidatableUseCases.getColor(object, type)

    if (type === 'node') {
      sigma.getGraph().setNodeAttribute(object.id, 'color', color)
    } else if (type === 'connection') {
      sigma.getGraph().setEdgeAttribute(object.id, 'color', color)
    }
  }
  
  function handleIsReviewedChipClicked() {
    if (!object || !isLoggedIn) {
      return;
    }

    object.isReviewed = !isReviewed;
    setIsReviewed((prev) => !prev);

    apiClient.updateIsReviewedLabel(object.id, object.isReviewed, endpoint);
    const color = ValidatableUseCases.getColor(object, type)

    if (type === 'node') {
      sigma.getGraph().setNodeAttribute(object.id, 'color', color)
    } else if (type === 'connection') {
      sigma.getGraph().setEdgeAttribute(object.id, 'color', color)
    }
  }
  
  useEffect(() =>  {
    setNeedsReview(object.needsReview);
    setNeedsCorrection(object.needsCorrection);
    setIsReviewed(object.isReviewed);
  }, [object])
  
  return (
    <>
      <Chip
        label="Needs Review"
        size="small"
        onClick={handleNeedsReviewChipClicked}
        style={{
          marginBottom: 20,
          marginRight: '10px',
          background: needsReview ? '#008bff' : '#eee',
          color: needsReview ? 'white' : 'black',
          cursor: isLoggedIn ? 'pointer' : 'default',
        }}
      />

      <Chip
        label="Needs Correction"
        size="small"
        onClick={handleNeedsCorrectionChipClicked}
        style={{
          marginBottom: 20,
          marginRight: '10px',
          background: needsCorrection ? '#ff0000' : '#eee',
          color: needsCorrection ? 'white' : 'black',
          cursor: isLoggedIn ? 'pointer' : 'default',
        }}
      />

      <Chip
        label="Is Reviewed"
        size="small"
        onClick={handleIsReviewedChipClicked}
        style={{
          marginBottom: 20,
          background: isReviewed ? '#25b012' : '#eee',
          color: isReviewed ? 'white' : 'black',
          cursor: isLoggedIn ? 'pointer' : 'default',
        }}
      />
    </>
  );
}

export default ReviewCorrectionChips;
