import styled from "@emotion/styled";
import { MaterialDesignContent, enqueueSnackbar } from "notistack";

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    backgroundColor: '#2D7738',
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: '#970C0C',
  },
}));

function useToastMessage() {
  function showToast(message: string, severity: "info" | "error" | "warning" | "success" = "success") {
    enqueueSnackbar(message, { variant: severity });
  }

  return { showToast };
}

export default useToastMessage;
