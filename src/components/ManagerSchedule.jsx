import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import ManagerSide from './ManagerSide';
import ManagerNavbar from './ManagerNavbar';
import Calendar from 'react-calendar';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { MdAutoDelete } from "react-icons/md";


const ManagerSchedule = () => {
  const [scheduleMeeting, setScheduleMeeting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const { isManagerLoggedIn } = useAuth();

  const navigate = useNavigate();

  const toggleCalendar = (meetingId = null) => {
    setShowCalendar(!showCalendar);
    setSelectedMeetingId(meetingId);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const db = getFirestore();
        let meetingCollection = collection(db, "scheduleMeeting");

        if (searchDate !== '') {
          meetingCollection = query(meetingCollection, where("date", "==", searchDate));
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

        const resolvedData = await Promise.all(promises);
        setScheduleMeeting(resolvedData);
      } catch (error) {
        setError("Error fetching meetings: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [searchDate]);

  const handleModify = async () => {
    if (!selectedMeetingId) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const db = getFirestore();
          const meetingDocRef = doc(db, "scheduleMeeting", selectedMeetingId);

          console.log(selectedMeetingId)

          const meetingDocSnapshot = await getDoc(meetingDocRef);
          if (!meetingDocSnapshot.exists()) {
            throw new Error(`Document with ID ${selectedMeetingId} does not exist`);
          }

          const adjustedDate = new Date(selectedDate);
          const ISTOffset = 330;
          adjustedDate.setMinutes(adjustedDate.getMinutes() + ISTOffset);
          const formattedDate = adjustedDate.toISOString().split('T')[0];

          await updateDoc(meetingDocRef, {
            date: formattedDate,
            time: selectedTime,
          });

          setScheduleMeeting((prevMeetings) =>
            prevMeetings.map((meeting) =>
              meeting.id === selectedMeetingId
                ? { ...meeting, date: formattedDate, time: selectedTime }
                : meeting
            )
          );
          toggleCalendar();
        } catch (error) {
          console.error("Error updating schedule meeting:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the schedule. Please try again later.",
            icon: "error",
          });
        }
      }
    });
  };

  if (!isManagerLoggedIn) {
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
      <ManagerSide />
      <div className="flex-1 overflow-hidden">
        <ManagerNavbar />
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
                          onClick={() => toggleCalendar(meeting.id)}
                          type="button"
                          className="text-white bg-[#11A798] rounded-lg p-2 text-center me-2 mb-2"
                        >
                          <FaEdit /> {/* Modify */}
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

            {showCalendar && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg">
                  <div className="w-full max-w-xs">
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      className="border border-gray-300 rounded-md shadow-md"
                      calendarClassName="bg-white p-4 rounded-lg shadow-lg"
                      tileClassName={({ date, view }) =>
                        view === 'month' && date.getDay() === 0 ? 'bg-red-200' : null
                      }
                    />
                  </div>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-3 block w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                  </select>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => toggleCalendar(null)}
                      className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleModify}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

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

export default ManagerSchedule;
