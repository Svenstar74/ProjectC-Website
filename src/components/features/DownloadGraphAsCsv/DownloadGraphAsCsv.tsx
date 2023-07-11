// import { MenuItem } from "@mui/material";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface Props {
  onClick: () => void;
}

function DownloadGraphAsCsv({ onClick }: Props) {  
  // const handleDownload = async () => {
  //   onClick();
  //   const text = await CsvService.toCsv(climateConceptNodesRepository, connectionsRepository);

  //   const link = document.createElement('a');
  //   link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
  //   link.setAttribute('download', 'graph.csv');

  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // };
  
  return (
    // <MenuItem onClick={handleDownload} disableRipple>
    //   <FileDownloadIcon />
    //   Download Graph as CSV
    // </MenuItem>
    <></>
  );
}

export default DownloadGraphAsCsv;
