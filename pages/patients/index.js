// pages\patients\index.js
import Link from "next/link";

const PatientsPage = () => {
  return (
    <div>
      <h1>All Patients</h1>
      <Link href="/patients/create">
        <button>Create New Patient</button>
      </Link>
    </div>
  );
};

export default PatientsPage;