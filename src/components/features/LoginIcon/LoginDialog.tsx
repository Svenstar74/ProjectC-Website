import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface Props {
  show: boolean;
  onClose: () => void;
  onLogin: (userName: string) => void;
}

function LoginDialog({ show, onClose, onLogin }: Props) {
  const [userName, setUserName] = useState('');

  function onLoginClick() {
    onLogin(userName);
    setUserName('');
  }

  return (
    <Dialog open={show} onClose={onClose}>
      <Box style={{ maxWidth: 500 }}>
        <DialogTitle>Login</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please enter your name. This will be used to track changes you make to the graph.
          </DialogContentText>

          <div style={{ marginTop: 20 }}>
            <TextField label="Username" variant="outlined" onChange={event => setUserName(event.target.value)} fullWidth />
          </div>
        </DialogContent>

        <DialogActions style={{ marginRight: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onLoginClick} disabled={userName.trim() === ''}>Login</Button>
        </DialogActions>

      </Box>
    </Dialog>
  );
}

export default LoginDialog;
