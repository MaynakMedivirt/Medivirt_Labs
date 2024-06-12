import React, { useState, useEffect } from "react";
import MrNavbar from "./MrNavbar";
import MrSide from "./MrSide";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa6";
import { PiChartPieSliceFill } from "react-icons/pi";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const MrDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [meetingCount, setMeetingCount] = useState(0);
  const [projectedEarnings, setProjectedEarnings] = useState(0);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchMessageCount = async () => {
      try {
        const db = getFirestore();
        const messageRef = collection(db, "messages");
        const q = query(messageRef, where("sentId", "==", id));
        const querySnapshot = await getDocs(q);

        const uniqueCompanies = new Set();
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          uniqueCompanies.add(messageData.doctorID);
        });

        setMessageCount(uniqueCompanies.size);
      } catch (error) {
        console.error("Error fetching unique company count:", error);
      }
    };

    const fetchMeetingCount = async () => {
      try {
        const db = getFirestore();
        const meetingRef = collection(db, "scheduleMeeting");
        const q = query(meetingRef, where("assigned", "==", id));
        const querySnapshot = await getDocs(q);
        setMeetingCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching meeting count:", error);
      }
    };

    fetchMessageCount();
    fetchMeetingCount();
  }, []);

  // useEffect(() => {
  //     setProjectedEarnings(meetingCount * 150);
  // }, [meetingCount]);

  return (
    <div className="flex flex-col h-screen">
      <MrNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <MrSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                      <AiFillMessage className="text-[#7191E6] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Messages</div>
                    <div className="text-2xl font-bold text-black">
                      {messageCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                      <RiCalendarScheduleLine className="text-[#7191E6] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Schedule-Meeting</div>
                    <div className="text-2xl font-bold text-black">
                      {meetingCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                      <FaChartLine className="text-[#7191E6] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Credits</div>
                    <div className="text-2xl font-bold text-black">
                      {meetingCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-gray-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                      <PiChartPieSliceFill className="text-[#7191E6] h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Analytics</div>
                    <div className="text-2xl font-bold text-black">----</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MrDashboard;
