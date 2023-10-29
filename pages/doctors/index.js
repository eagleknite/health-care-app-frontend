// pages\doctors\index.js
import DoctorsList from './DoctorsList';
import Link from 'next/link';

const DoctorsPage = () => {
  return (
    <div>
      <h1>All Doctors</h1>
      <Link href="/doctors/create">
        <button>Create New Doctor</button>
      </Link>
      <DoctorsList />
    </div>
  );
};

export default DoctorsPage;
