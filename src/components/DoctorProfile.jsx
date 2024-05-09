import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from "./Header";
import Footer from "./Footer";
import Image from "../assets/img/defaultAvatar.png";
import Banner from "../assets/img/Banner.png";
import Calendar from "react-calendar";
import "./style/Calendar.css";

const DoctorProfiles = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "doctors", id);
        const doctorSnapshot = await getDoc(docRef);
        if (doctorSnapshot.exists()) {
          setDoctor({ id: doctorSnapshot.id, ...doctorSnapshot.data() });
        } else {
          console.log("No such doctor");
        }
      } catch (error) {
        console.log("Error fetching doctor :", error);
      }
    };
    fetchDoctor();
  }, [id]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onChange = (date) => {
    setSelectedDate(date);
    // You can perform further actions with the selected date here
  };

  const handleBookSchedule = () => {
    // Handle booking the schedule here
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
  };

  if (!doctor) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-0 xl:max-w-[200rem] my-10">
        <div className="overflow-hidden mt-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10">
            <div className="col-span-1 md:col-span-2 mt-5">
              <div
                className="overflow-hidden"
                style={{
                  backgroundImage: `url(${Banner})`,
                  height: "250px",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex flex-col md:flex-row p-6 items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-full">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={`Profile of ${doctor.name}`}
                          className="w-32 h-32 md:w-48 md:h-48 rounded-full"
                        />
                      ) : (
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center">
                          {/* Placeholder image */}
                          <img src={Image} alt="Placeholder" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 md:flex-grow">
                    <h1 className="text-xl font-semibold text-gray-800 mb-2 underline underline-offset-4">
                      {doctor.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">
                      {doctor.specialist}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                      {doctor.currentPosition}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-b-2 border-gray-300 mt-8">
                <h3 className="font-semibold text-xl mb-3">About Doctor</h3>
                <p className="text-lg text-gray-600 mb-4">{doctor.about}</p>
              </div>

              <div className="my-[4rem] px-4 md:px-10 border-b-2 border-gray-200 ">
                <h2 className="font-semibold text-2xl">Experience</h2>
                {doctor.experience_1 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      A
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_1}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.experience_2 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      B
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_2}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.experience_3 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      C
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.experience_3}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="my-[4rem] px-4 md:px-10 ">
                <h2 className="font-semibold text-2xl">Education</h2>
                {doctor.education_1 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem] ">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      A
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_1}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.education_2 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      B
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_2}
                      </p>
                    </div>
                  </div>
                )}
                {doctor.education_3 && (
                  <div className="flex items-center mt-[3rem] mb-[1rem]">
                    <button className="bg-green-100 text-indigo font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                      C
                    </button>
                    <div className="px-5">
                      <p className="text-lg ml-2 font-semibold text-blue-800">
                        {doctor.education_3}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-1">
              <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
                <div className="">
                  <div className="mt-5">
                    <div className="p-6 md:p-5 md:h-auto">
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-lg ">Location:</p>
                        <p className="text-lg font-semibold">Bangalore</p>
                      </div>
                      <hr className="mb-3 border-gray-300"></hr>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-lg">Specialist:</span>
                        <span className="text-lg font-semibold">
                          {doctor.specialist}
                        </span>
                      </div>
                      <hr className="mb-3 border-gray-300"></hr>
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-lg">Gender: </p>
                        <p className="text-lg font-semibold capitalize">{doctor.gender}</p>
                      </div>
                      <hr className="mb-3 border-gray-300"></hr>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={toggleCalendar}
                          className="flex gap-1.5 justify-center items-center px-6 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                        >
                          {showCalendar ? "Hide Calendar" : "Schedule Meeting"}
                        </button>
                      </div>
                      {showCalendar && (
                        <div className="mt-5">
                          <Calendar onChange={onChange} value={selectedDate} minDate={new Date()}  className="custom-calendar" />
                          <div className="flex justify-between mt-3">
                            <select
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="p-2 border border-gray-300 rounded-md focus:outline-none w-full max-w-[200px]"
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
                          </div>
                          <div className="flex justify-center mt-5">
                            <button
                              onClick={handleBookSchedule}
                              disabled={!selectedTime}
                              className={`px-6 py-2 text-base font-bold text-center text-white uppercase ${
                                selectedTime
                                  ? "bg-blue-800 hover:bg-blue-600 cursor-pointer"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                            >
                              Book Schedule Meeting
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorProfiles;