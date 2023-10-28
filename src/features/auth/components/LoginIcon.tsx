import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import { useAppDispatch, useAppSelector } from "../../../store/redux/hooks";
import LoginDialog from './LoginDialog';
import { login, logout } from '../../../store/redux/slices/authSlice';

function LoginIcon() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  function handleLoginButton() {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      setShowLoginModal(true);
    }
  }

  function handleLoginDialog(userName: string) {
    setShowLoginModal(false);
    dispatch(login(userName));
  }
  
  return (
    <>
      <div style={{ position: 'absolute', right: 60, top: 10 }}>
        <Tooltip title={isLoggedIn ? 'Logout' : 'Login'}>
          <Fab style={{ background: 'white' }} onClick={handleLoginButton}>
            {!isLoggedIn && <PersonIcon fontSize="large" />}
            {isLoggedIn && <HowToRegIcon fontSize="large" />}
          </Fab>
        </Tooltip>
      </div>

      <LoginDialog show={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginDialog} />
    </>
  );
}

export default LoginIcon;
