// components/Header.js
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import { logout } from '@/slices/authSlice';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const userRole = user ? user.role : null;

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/'); // navigate back to home
  };

  return (
    <header className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-lg font-bold cursor-pointer">App Logo</span>
        </Link>
        <nav className="space-x-3 md:space-x-6 flex items-center">
          { isAuthenticated ? (
            <>
              <span>Welcome, {user?.firstName} {user?.lastName}</span>
              <Link href="/profile">Profile</Link>
              <Link href="/appointments">Appointments</Link>
              {userRole === 'Admin' && <Link href="/dashboard">Admin Dashboard</Link>}
              {userRole === 'Doctor' && <Link href="/dashboard">Doctor Dashboard</Link>}
              {userRole === 'Patient' && <Link href="/dashboard">Patient Dashboard</Link>}
              <button onClick={handleLogout}>Logout</button>
              <NotificationDropdown />
            </>
          ) : (
            <>
              <span className="cursor-pointer" onClick={() => router.push('/login')}>Sign In</span>
              <span className="cursor-pointer" onClick={() => router.push('/register')}>Register</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
