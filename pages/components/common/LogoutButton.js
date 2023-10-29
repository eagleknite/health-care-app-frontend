// pages\components\common\LogoutButton.js
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { logout } from '@/slices/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/'); // navigate back to home
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
