// pages\admins\index.js
import Link from 'next/link';

const AdminsPage = () => {
  return (
    <div>
      <h1>All Admins</h1>
      <Link href="/admins/create">
        <button>Create New Admin</button>
      </Link>
    </div>
  );
};

export default AdminsPage;
