import { Fab, Tooltip } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

function GetHelpButton() {
  function handleFabClick() {
    window.open('https://github.com/Svenstar74/ProjectC-react-frontend/wiki', '_blank');
  }

  return (
    <div style={{ position: 'absolute', right: 200, top: 10 }}>
      <Tooltip title='Go to the wiki'>
        <Fab style={{ background: 'white' }} onClick={handleFabClick}>
          <QuestionMarkIcon fontSize='large' sx={{ color: 'gray' }} />
        </Fab>
      </Tooltip>
    </div>
  );
}

export default GetHelpButton;
