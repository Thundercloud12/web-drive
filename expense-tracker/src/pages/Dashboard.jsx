import React from 'react';
import { Link, useParams } from 'react-router-dom';

const Dashboard = () => {
  const { user_id } = useParams();
  
  return (
    <div className="drawer lg:drawer-open mt-17">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col items-center justify-center">
        {/* Page content here */}
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li><Link to={`/dashboard/${user_id}/overview`}>Overview</Link></li>
          <li><Link to={`/dashboard/${user_id}/expense`}>Expense</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
