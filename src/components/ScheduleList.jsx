import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEdit } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { SiGooglemeet } from "react-icons/si";
import { MdAutoDelete } from "react-icons/md";


const ScheduleList = () => {
  const [scheduleMeeting, setScheduleMeeting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { isAdminLoggedIn } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const db = getFirestore();
        let meetingCollection = collection(db, "scheduleMeeting");

        if (searchDate !== '') {
          meetingCollection = query(meetingCollection, where("date", "==", searchDate));
        }

        if (searchTime !== '') {
          const trimmedSearchTime = searchTime.trim().toLowerCase();
          meetingCollection = query(meetingCollection, where("time", "==", trimmedSearchTime));
        }

        const snapshot = await getDocs(meetingCollection);

        const fetchCompanyData = async (companyId) => {
          const companyDocRef = doc(db, "companies", companyId);
          const companyDocSnapshot = await getDoc(companyDocRef);
          if (companyDocSnapshot.exists()) {
            return companyDocSnapshot.data();
          } else {
            return null;
          }
        };

        const fetchDoctorData = async (doctorId) => {
          const doctorDocRef = doc(db, "doctors", doctorId);
          const doctorDocSnapshot = await getDoc(doctorDocRef);
          if (doctorDocSnapshot.exists()) {
            return doctorDocSnapshot.data();
          } else {
            return null;
          }
        };

        const promises = snapshot.docs.map(async (doc) => {
          const meetingData = doc.data();
          // console.log(meetingData);

          // Fetch company data
          const companyData = await fetchCompanyData(meetingData.companyID);
          const companyName = companyData
            ? companyData.companyName
            : "Unknown Company";
          const representativeName = companyData
            ? companyData.name
            : "Unknown Representative";

          // Fetch doctor data
          const doctorData = await fetchDoctorData(meetingData.doctorID);
          const doctorName = doctorData ? doctorData.name : "Unknown Doctor";

          return {
            id: doc.id,
            companyName,
            representativeName,
            doctorName,
            ...meetingData,
          };
        });

        // console.log(companyDoc.data().name);

        const resolvedData = await Promise.all(promises);
        setScheduleMeeting(resolvedData);
      } catch (error) {
        setError("Error fetching meetings: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [searchDate, searchTime]);

  // if (loading) {
  //     return <div>Loading...</div>;
  // }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  const handleDeleteMeeting = async (meetingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (confirmed) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "scheduleMeeting", meetingId));
        setScheduleMeeting((prevMeetings) =>
          prevMeetings.filter((scheduleMeetings) => scheduleMeetings.id !== meetingId)
        );
      } catch (error) {
        console.error("Error deleting Meeting:", error);
      }
    }
  };

  // const generateTimeOptions = () => {
  //   const timeOptions = [];
  //   for (let hour = 0; hour < 24; hour++) {
  //     for (let minute = 0; minute < 60; minute += 30) {
  //       const hourString = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
  //       const minuteString = minute.toString().padStart(2, '0');
  //       const ampm = hour < 12 ? 'AM' : 'PM';
  //       timeOptions.push(`${hourString}:${minuteString} ${ampm}`);
  //     }
  //   }
  //   return timeOptions;
  // };

  // const timeOptions = generateTimeOptions();

  const indexOfLastMeeting = currentPage * itemsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - itemsPerPage;
  const currentMeetings = scheduleMeeting.slice(indexOfFirstMeeting, indexOfLastMeeting);

  const sortedMeetings = [...currentMeetings].sort((a, b) => {

    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }

    const timeA = a.time.split(' ')[0];
    const timeB = b.time.split(' ')[0];
    return new Date(`1970/01/01 ${timeA}`) - new Date(`1970/01/01 ${timeB}`);
  });

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1 overflow-hidden">
        <AdminNavbar />
        <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
          <div className="border mt-4 p-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-center text-3xl font-bold">Schedule List</h2>
            </div>

            <div className="flex justify-end items-center mb-5">
              <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="p-2"
                />
              </div>
              {/* <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="p-2"
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((timeOption, index) => (
                    <option key={index} value={timeOption}>{timeOption}</option>
                  ))}
                </select>
              </div> */}
              <button
                onClick={() => console.log('Search logic here')}
                className="p-2 rounded bg-[#11A798] text-white  hover:bg-[#3D52A1] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              >
                Search
              </button>
            </div>

            <div className="overflow-auto mt-3">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-2 text-sm tracking-wider"
                    >
                      S.N.
                    </th>
                    <th
                      scope="col"
                      className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-sm uppercase tracking-wider"
                    >
                      Representative Name
                    </th>
                    <th
                      scope="col"
                      className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider"
                    >
                      Doctor Name
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-sm uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-2 bg-gray-50 py-2 text-sm uppercase tracking-wider"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-sm uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-sm divide-y divide-gray-200">
                  {sortedMeetings.map((meeting, index) => (
                    <tr key={meeting.id} className="border-b border-gray-200">
                      <td scope="row" className="px-2 py-2">
                        {index + 1}
                      </td>
                      <td
                        scope="row"
                        className="px-2 py-2 font-medium text-gray-900 bg-gray-50"
                      >
                        {meeting.companyName}
                      </td>
                      <td className="px-2 py-2">
                        {meeting.representativeName}
                      </td>
                      <td className="px-2 py-2 bg-gray-50">
                        {meeting.doctorName}
                      </td>
                      <td className="px-2 py-2">{meeting.date}</td>
                      <td className="px-2 py-2 bg-gray-50">{meeting.time}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                        >
                          <FaEdit /> {/* Modify */}
                        </button>
                        <button
                          type="button"
                          className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                        >
                          <TiTick /> {/* Accept */}
                        </button>
                        <button
                          type="button"
                          className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                        >
                          <SiGooglemeet /> {/* Join Now */}
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          type="button"
                          className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                        >
                          <MdAutoDelete /> {/* Delete */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end my-4">
              {Array.from({ length: Math.ceil(scheduleMeeting.length / itemsPerPage) }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-2 mx-1 rounded-md font-bold ${currentPage === i + 1 ? 'bg-transparent text-gray-800 border border-[#11A798] hover:bg-[#11A798] hover:text-white' : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300'}`}
                  onClick={() => handlePageClick(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
              {`Showing ${sortedMeetings.length} out of ${scheduleMeeting.length} matches`}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
