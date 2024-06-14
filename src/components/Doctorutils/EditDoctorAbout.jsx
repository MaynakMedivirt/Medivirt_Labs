import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import DoctorNavbar from "./DoctorNavbar";
import DoctorSide from "./DoctorSide";
import { IoMdArrowBack } from "react-icons/io";
import "../style/Doctor.css";

const EditDoctorAbout = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const doctorRef = doc(db, "doctors", id);
      const newData = {
        ...doctor,
      };

      await updateDoc(doctorRef, newData);

      console.log("Document successfully updated!");
      alert("Data successfully updated!");
      // setDoctor(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate(`/doctor/profile/${id}`);

      // fetchDoctor();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <DoctorNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <DoctorSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="flex items-center justify-between" id="edittexts">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 bg-white shadow border rounded-full flex items-center justify-center"
                >
                  <IoMdArrowBack className="h-6 w-6 font-bold text-[#8697C4]" />
                </button>
                <h2 className="flex-grow text-2xl my-5 font-bold text-center uppercase">
                  Edit About
                </h2>
              </div>
              
              <div class="mb-5">
                <label
                  htmlFor="about"
                  class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white"
                >
                  About :
                </label>
                <textarea
                  name="about"
                  id="about"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={doctor ? doctor.about : ""}
                  onChange={(e) =>
                    setDoctor({ ...doctor, about: e.target.value })
                  }
                  placeholder=" "
                ></textarea>
              </div>
              <div className="flex justify-end items-center">
                <button
                  type="submit"
                  class="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                >
                  save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorAbout;
