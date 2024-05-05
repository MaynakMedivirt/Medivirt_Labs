import React from 'react';
import AdminSide from './AdminSide';
import AdminNavbar from './AdminNavbar';


const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1">
        <AdminNavbar />
        <div className="container max-w-6xl px-5 mx-auto my-10">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-100 shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-rose-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    {/* <HiInboxArrowDown className='h-6 w-6' /> */}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Messages</div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;
