// pages\login.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'; 
import { login } from '../slices/authSlice';
import Header from './components/common/Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
   const router = useRouter();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);
  const [errorMsg, setErrorMsg] = useState('');


  useEffect(() => {
    if (error) {
      setErrorMsg(`Login failed: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
        alert('Login successful');
        if (user.role !== 'Admin') { 
            router.push('/profile');
        } else {
            router.push('/dashboard');
        }
      }
  }, [isAuthenticated]);


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { email, password };
    dispatch(login(user));
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

