// pages\index.js
import { Inter } from 'next/font/google'
import Header from '@/pages/components/common/Header'
import { refreshAccessToken } from '@/slices/authSlice'
import { useRouter } from 'next/router'; 
import store from '@/store'

import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })


axios.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 419 && !originalRequest._retry) {
    originalRequest._retry = true;
    // Dispatch the refreshAccessToken action
    const actionResult = await store.dispatch(refreshAccessToken());
    if (refreshAccessToken.fulfilled.match(actionResult)) {
      const newToken = actionResult.payload;
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axios(originalRequest);
    } else {
      // Handle refresh token failure logic
    }
  }
  return Promise.reject(error);
});


export default function Home() {
  const router = useRouter();
  return (
    <main className={`${inter.className} w-full`}>
      <Header />
      <section id="hero" className="bg-gray-100 p-5 md:p-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold">Revolutionizing Healthcare Management</h1>
          <p className="text-md md:text-xl mt-3 md:mt-5">Manage your patients and appointments effortlessly.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white mt-4 md:mt-6 px-5 py-3 rounded-md transition duration-300" onClick={() => router.push('/register')}>
            Get Started
          </button>
        </div>
      </section>
      <section id="how-it-works" className="bg-gray-200 p-5 md:p-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-semibold">How It Works</h2>
          <ol className="list-decimal list-inside mt-4 md:mt-6 text-left">
            <li>Sign Up: Create your account to get started.</li>
            <li>Set Up Profile: Input your professional details or medical history.</li>
            <li>Start Managing: Schedule and manage appointments or patient data.</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
