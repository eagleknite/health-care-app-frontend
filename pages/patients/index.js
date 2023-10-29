// pages\patients\index.js
import PatientsList from "./PatientsList";
import Link from "next/link";

const PatientsPage = () => {
  return (
    <div>
      <h1>All Patients</h1>
      <Link href="/patients/create">
        <button>Create New Patient</button>
      </Link>
      <PatientsList />
    </div>
  );
};

export default PatientsPage;