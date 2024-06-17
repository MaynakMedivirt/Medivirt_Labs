import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import DoctorSide from "./DoctorSide";
import DoctorNavbar from "./DoctorNavbar";
import { MdCreditScore } from "react-icons/md";
import "../style/Doctor.css";

const DoctorEarning = () => {
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meetingCount, setMeetingCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [meetingsPerPage] = useState(5);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchCompletedMeetings = async () => {
      try {
        const db = getFirestore();
        const meetingRef = collection(db, "scheduleMeeting");
        const q = query(
          meetingRef,
          where("doctorID", "==", id),
          where("status", "==", "completed")
        );
        const querySnapshot = await getDocs(q);

        const fetchCompanyData = async (companyId) => {
          const companyDocRef = doc(db, "companies", companyId);
          const companyDocSnapshot = await getDoc(companyDocRef);
          if (companyDocSnapshot.exists()) {
            return companyDocSnapshot.data();
          } else {
            return null;
          }
        };

        const completedMeetingsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const meetingData = doc.data();
            const companyData = await fetchCompanyData(meetingData.companyID);
            return {
              id: doc.id,
              ...meetingData,
              companyName: companyData
                ? companyData.companyName
                : "Unknown Company",
              representativeName: companyData
                ? companyData.name
                : "Unknown Company",
            };
          })
        );

        setCompletedMeetings(completedMeetingsData);
      } catch (error) {
        console.error("Error fetching completed meetings:", error);
      }
    };

    const fetchMeetingCount = async () => {
      try {
        const db = getFirestore();
        const meetingRef = collection(db, "scheduleMeeting");
        const q = query(meetingRef, where("doctorID", "==", id));
        const querySnapshot = await getDocs(q);
        setMeetingCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching meeting count:", error);
      }
    };

    fetchCompletedMeetings();
    fetchMeetingCount();
  }, [id]);

  const indexOfLastMeeting = currentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = completedMeetings.slice(
    indexOfFirstMeeting,
    indexOfLastMeeting
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const projected = meetingCount * 150;
  const final = completedMeetings.length * 150;

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-margin duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-10">
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="bg-white border shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                      <MdCreditScore className="text-[#8697C4] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Projected Earning</div>
                    <div className="text-2xl font-bold text-black">
                      {projected}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                      <MdCreditScore className="text-[#8697C4] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Final Earning</div>
                    <div className="text-2xl font-bold text-black">{final}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-[4rem] border">
              <div className="my-5 text-center">
                <h1 className="font-bold text-xl uppercase">
                  Completed Meetings ({completedMeetings.length})
                </h1>
              </div>

              <div className="relative overflow-auto shadow-md sm:rounded-lg mt-3 table-container">
                <table className="divide-y border divide-gray-300 w-full text-left rtl:text-right">
                  <thead className="text-sm text-gray-700 uppercase ">
                    <tr>
                      <th
                        scope="col"
                        className="px-2 py-3 tracking-wider bg-gray-50"
                      >
                        S.N.
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Company Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 tracking-wider bg-gray-50"
                      >
                        Representative Name
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 tracking-wider bg-gray-50"
                      >
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedMeetings.length === 0 ? (
                      <tr className="bg-white border-b dark:border-gray-200">
                        <td colSpan="5" className="text-center py-4">
                          <p className="text-lg">
                            No completed meetings found.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentMeetings.map((meeting, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b dark:border-gray-200"
                        >
                          <td
                            scope="row"
                            className="px-2 py-3 bg-gray-50 text-center font-medium"
                          >
                            {index + 1}.
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {meeting.companyName}
                          </td>
                          <td className="px-4 py-3 bg-gray-50">
                            {meeting.representativeName}
                          </td>
                          <td className="px-4 py-3">
                            {meeting.date}
                          </td>
                          <td className="px-4 py-3 bg-gray-50">{meeting.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end my-4">
                {Array.from(
                  {
                    length: Math.ceil(
                      completedMeetings.length / meetingsPerPage
                    ),
                  },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-2 mx-1 rounded-md font-bold ${
                        currentPage === i + 1
                          ? "bg-transparent text-gray-800 border border-[#7191E6] hover:bg-[#7191E6] hover:text-white"
                          : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorEarning;
