import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import DoctorNavbar from "./DoctorNavbar";
import DoctorSide from "./DoctorSide";
import Image from "../../assets/img/female-doctor.png";
import { FaPen } from "react-icons/fa";

const DocdashProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

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

  const saveProfile = async () => {
    try {
      const db = getFirestore();
      const doctorRef = doc(db, "doctors", id);
      await updateDoc(doctorRef, doctor);
      console.log("Doctor profile updated successfully!");
      alert("profile updated successfully!");
      navigate(`/doctorDashboard/${id}`);
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      // Handle error: display an error message to the user
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const EditAbout = () => {
    navigate(`/doctor/profile/edit-about/${id}`);
  };

  const EditExperience = () => {
    navigate(`/doctor/profile/edit-experience/${id}`);
  };

  const EditEducation = () => {
    navigate(`/doctor/profile/edit-education/${id}`);
  };

  const EditCurrentPosition = () => {
    navigate(`/doctor/profile/edit-currentposition/${id}`);
  };

  const EditImage = () => {
    navigate(`/doctor/profile/edit-image/${id}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-72" : "ml-20"
          }`}
        >
          {/* Your content goes here */}
          {doctor && (
            <div className="container max-w-6xl px-5 mx-auto my-10">
              <div className="overflow-hidden mt-[20px]">
                <div className="flex flex-col pt-[5rem] px-2 bg-[#7191E6] rounded">
                  <div className="flex flex-col bg-[#E3E9E9] px-2 pb-2 rounded text-base text-neutral-800 max-md:max-w-full mb-4">
                    <div className="py-2 font-sans leading-8 max-md:max-w-full grid grid-cols-1 md:grid-cols-5 gap-4">
                      {/* <div className="grid grid-cols-5 gap-4"> */}
                      <div className="col-span-2 ...">
                        <div className="flex">
                          <div>
                            <div className="flex-shrink w-16 h-16 rounded">
                              {doctor.image ? (
                                <img
                                  src={doctor.image}
                                  alt={`Profile of ${doctor.name}`}
                                  className="w-full h-full"
                                />
                              ) : (
                                <div className="flex-shrink w-16 h-16 rounded">
                                  {/* Placeholder image */}
                                  <img
                                    src={Image}
                                    className="w-full h-full "
                                    alt="User Profile"
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-end" onClick={EditImage}>
                              <FaPen
                                className="text-[#7091E6]"
                                style={{ float: "inline-end" }}
                              />
                            </p>
                          </div>

                          <div className="px-4 md:flex-grow m-auto">
                            <h1 className="text-lg font-semibold text-gray-800 ">
                              {doctor.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                              {doctor.specialist}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 ... m-auto">
                        <div className="flex-grow">
                          <div className="flex">
                            <h1 className="text-lg font-semibold text-gray-800 ">
                              Current Position
                            </h1>
                            <p
                              className="text-end px-5 mt-1"
                              onClick={EditCurrentPosition}
                            >
                              <FaPen
                                className="text-[#7091E6]"
                                style={{ float: "inline-end" }}
                              />
                            </p>
                          </div>

                          <p className="text-sm text-gray-500">
                            {doctor.currentPosition}
                          </p>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-4 mt-[3rem] bg-white border shadow-2xl rounded">
                  <div className="flex-grow">
                    <h1 className="text-xl font-semibold text-gray-800 mb-3">
                      About
                    </h1>
                    <p className="text-md text-gray-500 mb-2">{doctor.about}</p>
                    <p className="text-end" onClick={EditAbout}>
                      <FaPen
                        className="bg-white border text-[#7091E6]"
                        style={{ float: "inline-end" }}
                      />
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="bg-white border shadow-2xl rounded p-4">
                    <div className="flex-grow mb-[2rem] mt-4 ">
                      <p className="text-end" onClick={EditExperience}>
                        <FaPen
                          className="bg-white text-[#7091E6]"
                          style={{ float: "inline-end" }}
                        />
                      </p>
                      <h1 className="text-xl font-semibold">Experience</h1>

                      {doctor.experience_1 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            A
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.experience_1}</p>
                          </div>
                        </div>
                      )}

                      {doctor.experience_2 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            B
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.experience_2}</p>
                          </div>
                        </div>
                      )}

                      {doctor.experience_3 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            C
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.experience_3}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white border shadow-2xl rounded p-4">
                    <div className="flex-grow mb-[2rem] mt-4 ">
                      <p className="text-end" onClick={EditEducation}>
                        <FaPen
                          className="bg-white text-[#7091E6]"
                          style={{ float: "inline-end" }}
                        />
                      </p>
                      <h1 className="text-xl font-semibold">Education</h1>
                      {doctor.education_1 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            A
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.education_1}</p>
                          </div>
                        </div>
                      )}

                      {doctor.education_2 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            B
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.education_2}</p>
                          </div>
                        </div>
                      )}

                      {doctor.education_3 && (
                        <div className="mt-5 flex items-center">
                          <button className="bg-white shadow px-3 border text-[#7091E6] font-semibold rounded-full h-8 w-8 flex items-center justify-center">
                            C
                          </button>
                          <div className="px-5">
                            <p className="text-sm ">{doctor.education_3}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center mb-[3rem]">
                  <button
                    onClick={saveProfile}
                    className="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                  >
                    save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocdashProfile;
