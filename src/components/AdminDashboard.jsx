import React, { useState, useEffect } from 'react';
import AdminSide from './AdminSide';
import { Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FaUserDoctor } from "react-icons/fa6";
import { FaCompactDisc } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useAuth } from './AuthContext';


const AdminDashboard = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalMangers, setTotalManagers] = useState(0);
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const { isAdminLoggedIn } = useAuth();

  useEffect(() => {
    fetchTotalDoctors();
    fetchTotalCompanies();
    fetchTotalManagers();
    fetchTotalMeetings();
    fetchTotalMessage();
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

  const fetchTotalMeetings = async () => {
    try {
      const db = getFirestore();
      const meetingCollection = collection(db, 'scheduleMeeting');
      const snapshot = await getDocs(meetingCollection);
      setTotalMeetings(snapshot.size);
    } catch (error) {
      console.error('Error fetching total meetings:', error);
    }
  };

  const fetchTotalMessage = async () => {
    try {
      const db = getFirestore();
      const messageCollection = collection(db, 'messages');
      const snapshot = await getDocs(messageCollection);
      setTotalMessages(snapshot.size);
    } catch (error) {
      console.error('Error fetching total messages:', error);
    }
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

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

            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <RiCalendarScheduleLine className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Schedule Meetings</div>
                  <div className="text-2xl font-bold text-gray-900">{totalMeetings}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <RiCalendarScheduleLine className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Completed</div>
                  <div className="text-2xl font-bold text-gray-900">{totalMeetings}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 border shadow-sm rounded p-5">
              <div className="flex space-x-4 items-center">
                <div>
                  <div className="bg-white rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <AiFillMessage className='h-6 w-6 text-[#11A798]' />
                  </div>
                </div>
                <div>
                  <div className="">Messages</div>
                  <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
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
