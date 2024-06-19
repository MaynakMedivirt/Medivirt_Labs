import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import CompanySide from "./CompanySide";
import CompanyNavbar from "./CompanyNavbar";
import "../style/Company.css";

const CompanyMissedMeetings = () => {
  const [missedMeetings, setMissedMeetings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchMissedMeetings = async () => {
      try {
        const db = getFirestore();
        const meetingsRef = collection(db, "scheduleMeeting");
        const q = query(meetingsRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);
        const now = new Date();

        const fetchDoctorData = async (doctorId) => {
          const doctorDocRef = doc(db, "doctors", doctorId);
          const doctorDocSnapshot = await getDoc(doctorDocRef);
          if (doctorDocSnapshot.exists()) {
            return doctorDocSnapshot.data();
          } else {
            return null;
          }
        };

        const fetchCompanyData = async (companyId) => {
          const companyDocRef = doc(db, "companies", companyId);
          const companyDocSnapshot = await getDoc(companyDocRef);
          if (companyDocSnapshot.exists()) {
            return companyDocSnapshot.data();
          } else {
            return null;
          }
        };

        const missedMeetingsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const meetingData = doc.data();
            const doctorData = await fetchDoctorData(meetingData.doctorID);
            const companyData = await fetchCompanyData(meetingData.companyID);
            return {
              id: doc.id,
              ...meetingData,
              doctorName: doctorData ? doctorData.name : "Unknown Doctor",
              companyName: companyData
                ? companyData.companyName
                : "Unknown Company",
            };
          })
        );

        const filteredMissedMeetings = missedMeetingsData.filter((meeting) => {
          const meetingDateTime = new Date(`${meeting.date} ${meeting.time}`);
          return meetingDateTime < now;
        });

        setMissedMeetings(filteredMissedMeetings);
      } catch (error) {
        console.error("Error fetching missed meetings:", error);
      }
    };

    fetchMissedMeetings();
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <CompanyNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-10">
            <h2 className="text-[1.5rem] my-5 font-bold text-center uppercase">
              <span className="bg-[#8697C4] text-white p-2">
                {" "}
                Missed Meetings{" "}
              </span>
            </h2>
            <div className="overflow-auto shadow-md sm:rounded-lg mt-3 table-container">
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
                      Doctor Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Company Name
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
                  {missedMeetings.length === 0 ? (
                    <tr className="bg-white border-b dark:border-gray-200">
                      <td colSpan="5" className="text-center py-4">
                        <p className="text-lg">No Missed meetings.</p>
                      </td>
                    </tr>
                  ) : (
                    missedMeetings.map((meeting, index) => (
                      <tr
                        key={meeting.id}
                        className="bg-white border-b dark:border-gray-200"
                      >
                        <td
                          scope="row"
                          className="px-2 py-3 bg-gray-50 text-center font-medium"
                        >
                          {index + 1}.
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {meeting.doctorName}
                        </td>
                        <td className="px-4 py-3 bg-gray-50">{meeting.companyName}</td>
                        <td className="px-4 py-3">{meeting.date}</td>
                        <td className="px-4 py-3 bg-gray-50">{meeting.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyMissedMeetings;
