import React, { useState, useEffect } from 'react';
import AdminSide from './AdminSide';
import AdminNavbar from './AdminNavbar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FaUserDoctor } from "react-icons/fa6";
import { FaCompactDisc } from "react-icons/fa";


const AdminDashboard = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);

  useEffect(() => {
    const fetchTotalDoctors = async () => {
      try {
        const db = getFirestore();
        const doctorsCollection = collection(db, 'doctors');
        const snapshot = await getDocs(doctorsCollection);
        setTotalDoctors(snapshot.size);
      } catch (error) {
        console.error('Error fetching total doctors:', error);
      }
    };

    fetchTotalDoctors();
  }, []);

  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1">
        <AdminNavbar />
        <div className="container max-w-6xl px-5 mx-auto my-10">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <FaUserDoctor className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Total Doctors</div>
                  <div className="text-2xl font-bold text-gray-900">{totalDoctors}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <FaCompactDisc className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Total Companies</div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
