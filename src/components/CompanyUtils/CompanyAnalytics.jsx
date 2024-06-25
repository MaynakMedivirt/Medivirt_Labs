import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";
import { AiFillMessage } from "react-icons/ai";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { PiChartPieSliceFill } from "react-icons/pi";
import {getFirestore, collection, query, where, getDocs, onSnapshot, doc, getDoc,} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Graph from "../../assets/img/graph.PNG";
import {Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip, Legend,} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CompanyAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meetingData, setMeetingData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [userData, setUserData] = useState({});
  const [assignedUsersData, setAssignedUsersData] = useState([]);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const db = getFirestore();
        const scheduleMeetingsRef = collection(db, "scheduleMeeting");
        const q = query(scheduleMeetingsRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);

        const meetingsByMonth = {};

        querySnapshot.forEach((doc) => {
          const meetingData = doc.data();
          const meetingDate = new Date(meetingData.date);
          const month = meetingDate.toLocaleString("default", {
            month: "short",
          });
          const year = meetingDate.getFullYear();
          const key = `${month} ${year}`;

          if (!meetingsByMonth[key]) {
            meetingsByMonth[key] = 0;
          }
          meetingsByMonth[key]++;
        });

        const currentYear = new Date().getFullYear();

        const sortedMeetingLabels = Object.keys(meetingsByMonth).sort(
          (a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");

            if (parseInt(yearA) !== parseInt(yearB)) {
              return parseInt(yearA) - parseInt(yearB);
            }

            const months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            return months.indexOf(monthA) - months.indexOf(monthB);
          }
        );

        const meetingCounts = sortedMeetingLabels.map(
          (label) => meetingsByMonth[label]
        );

        setMeetingData(meetingsByMonth);

        const updatedChartData = {
          labels: sortedMeetingLabels,
          datasets: [
            {
              label: "Total Meetings",
              data: meetingCounts,
              fill: false,
              borderColor: "rgba(119,150,230,1)",
              borderWidth: 2,
              tension: 0.1,
              pointStyle: "rectRounded",
              pointBorderWidth: 2,
            },
          ],
        };

        setChartData(updatedChartData); // Set the chart data state
      } catch (error) {
        console.error("Error fetching schedule meetings:", error);
      }
    };

    const fetchAssignedUsersData = async () => {
      try {
        const db = getFirestore();
        const scheduleMeetingsRef = collection(db, "scheduleMeeting");
        const q = query(scheduleMeetingsRef, where("companyID", "==", id));
        const querySnapshot = await getDocs(q);

        const assignedUsersCount = {};
        querySnapshot.forEach((doc) => {
          const meetingData = doc.data();
          const assigned = meetingData.assigned;

          if (!assignedUsersCount[assigned]) {
            assignedUsersCount[assigned] = 0;
          }

          assignedUsersCount[assigned]++;
        });

        const userPromises = Object.keys(assignedUsersCount).map(
          async (userId) => {
            let assignedName = "";
            let assignedRole = "";

            try {
              const companyDocRef = doc(db, "companies", userId);
              const companyDocSnapshot = await getDoc(companyDocRef);

              if (companyDocSnapshot.exists()) {
                assignedName = companyDocSnapshot.data().name;
                assignedRole = companyDocSnapshot.data().role;
              } else {
                const userDocRef = doc(db, "users", userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data();
                  assignedName = `${userData.firstName} ${userData.lastName}`;
                  assignedRole = userData.role;
                } else {
                  console.error(`No document found with ID ${userId}`);
                }
              }
            } catch (error) {
              console.error("Error fetching assigned data:", error);
            }

            return {
              userId,
              assignedName,
              assignedRole,
              count: assignedUsersCount[userId],
            };
          }
        );

        const resolvedUserData = await Promise.all(userPromises);
        setAssignedUsersData(resolvedUserData);

        // Construct userData for the bar chart
        const userNames = resolvedUserData.map((data) => data.assignedName);
        const meetingCounts = resolvedUserData.map((data) => data.count);
        const colors = ["rgba(119,150,230,1)", "rgba(61,82,161,1)"]; // Define your alternate colors

        const userData = {
          labels: userNames,
          datasets: [
            {
              label: "Scheduled Meetings",
              data: meetingCounts,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
            },
          ],
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching assigned users data:", error);
      }
    };

    fetchMeetings();
    fetchAssignedUsersData();

    return () => {};
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <CompanyNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-margin duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <FaChartLine className="mr-2" /> Meetings
                </h2>
              </div>
              {/* <Line data={chartData} /> */}
              {Object.keys(chartData).length > 0 && <Line data={chartData} />}
            </div>

            <div className="bg-white p-2 rounded shadow-md">
              <div className="bg-[#8697C4] text-white p-2">
                <h2 className="text-lg font-bold flex items-center">
                  <PiChartPieSliceFill className="mr-2" /> Doctors
                </h2>
              </div>
              {Object.keys(userData).length > 0 && (
                <Bar
                  data={userData}
                  options={{
                    indexAxis: "y",
                    elements: {
                      bar: {
                        barPercentage: 0.8,
                        categoryPercentage: 1.0,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnalytics;
