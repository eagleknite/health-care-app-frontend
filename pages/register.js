// components/Register.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';  // Import useRouter from next/router
import { register } from '../slices/authSlice';
import Header from './components/common/Header';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Patient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();  // Use useRouter
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMsg(`Registration failed: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
        alert('Registration successful');
        if (user.role !== 'Admin') { // Add this condition
            router.push('/profile');
        } else {
            router.push('/dashboard');
        }
      }
  }, [isAuthenticated]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const user = { email, password, role, firstName, lastName };
    dispatch(register(user));
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name:</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name:</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} 
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password:</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 px-3 py-2">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Confirm Password:</label>
              <input type="password" value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} 
                      className="mt-1 p-2 w-full border rounded-md">
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
