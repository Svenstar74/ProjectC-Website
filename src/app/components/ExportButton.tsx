import { Fab, Tooltip } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { CsvService } from '@svenstar74/business-logic';

import { useApiClient } from "../hooks/useApiClient";

export const ExportButton = () => {
  const apiClient = useApiClient();
  
  const downloadCsv = async () => {
    const allNodes = await apiClient.getAllNodesAggregated()
    const text = CsvService.aggregatedNodesToCsv(allNodes);

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    link.setAttribute('download', 'graph.csv');

    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  
  return (
    <Tooltip title="Download CSV">
      <Fab color="primary" size="small" onClick={downloadCsv}>
        <FileDownloadIcon />
      </Fab>
    </Tooltip>
  )
}
