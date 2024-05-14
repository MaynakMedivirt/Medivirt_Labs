import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import ManagerNavbar from './ManagerNavbar';
import ManagerSide from './ManagerSide';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FaUserDoctor } from "react-icons/fa6";
import { FaCompactDisc } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { useAuth } from './AuthContext';


const ManagerDashboard = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalMangers, setTotalManagers] = useState(0);
  const { isManagerLoggedIn } = useAuth();

  useEffect(() => {
    fetchTotalDoctors();
    fetchTotalCompanies();
    fetchTotalManagers();
  }, []);

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

  const fetchTotalCompanies = async () => {
    try {
      const db = getFirestore();
      const companiesCollection = collection(db, 'companies');
      const snapshot = await getDocs(companiesCollection);
      setTotalCompanies(snapshot.size);
    } catch (error) {
      console.error('Error fetching total companies:', error);
    }
  };

  const fetchTotalManagers = async () => {
    try {
      const db = getFirestore();
      const managersCollection = collection(db, 'managers');
      const snapshot = await getDocs(managersCollection);
      setTotalManagers(snapshot.size);
    } catch (error) {
      console.error('Error fetching total managers:', error);
    }
  };

  if (!isManagerLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex">
      <ManagerSide />
      <div className="flex-1">
        <ManagerNavbar />
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
                  <div className="text-2xl font-bold text-gray-900">{totalCompanies}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <MdManageAccounts className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Growth Managers</div>
                  <div className="text-2xl font-bold text-gray-900">{totalMangers}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
