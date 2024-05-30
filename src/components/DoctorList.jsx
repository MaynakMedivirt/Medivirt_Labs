import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import FilterMenu from "../pages/FilterMenu";
import DoctorCards from "../pages/DoctorCards ";
import defaultAvatar from "../assets/img/defaultAvatar.png";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const db = getFirestore();
        const doctorsCollection = collection(db, "doctors");
        const snapshot = await getDocs(doctorsCollection);
        const doctorsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctors(doctorsData);
      } catch (error) {
        setError("Error fetching doctors: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleViewProfile = (doctor) => {
    if (currentUser && (currentUser.emailVerified || currentUser.name || currentUser.username)) {
      navigate(`/doctor/${doctor.id}`);
    } else {
      setShowSignInMessage(true);
      setTimeout(() => {
        setShowSignInMessage(false);
        navigate("/login");
      }, 3000);
    }
  };

  const allSpecialists = [
    "Orthopaedic",
    "Cardiologist",
    "Gynaecologist",
    "Radiologist",
    "Dermatologist",
    "Oncology ",
    "Neurology",
    "Urology",
    "Ophthalmology",
    "Paediatric",
  ];

  const allLocations = [
    "Bangalore",
    "Delhi",
    "Mumbai",
    "Kolkata",
    "Hyderabad",
    "Chennai",
  ];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSpecialists.length === 0 ||
        selectedSpecialists.includes(doctor.specialist)) &&
      (selectedLocations.length === 0 ||
        selectedLocations.includes(doctor.location))
  );

  const totalPages = Math.ceil(filteredDoctors.length / 24);
  const startIndex = (currentPage - 1) * 24;
  const endIndex = Math.min(startIndex + 24, filteredDoctors.length);
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      {showSignInMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-2">
              You need to sign in to view doctor profiles.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
            <img
              className="w-10 h-10 animate-spin text-[#3d] mx-auto mt-5"
              src="https://www.svgrepo.com/show/448500/loading.svg"
              alt="Loading icon"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center px-16 pt-6 bg-red-50 max-md:px-5">
        <div className="flex gap-5 justify-between items-start w-full max-w-[1176px] max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col ml-[14rem] text-base text-neutral-800 max-md:max-w-full mb-4">
            <div className="text-4xl font-bold font-sans leading-8 max-md:max-w-full">
              Find Your Doctor Here
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 py-2.5 pr-2.5 pl-5 mt-6 bg-white rounded max-md:flex-wrap max-md:max-w-full">
              <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                <div className="flex flex-col justify-center self-stretch px-3 py-px my-auto border-r border-gray-200 border-solid">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name"
                    className="px-4 py-4 border-gray-300 rounded-md max-md:w-[200px]"
                  />
                </div>
                <div className="flex gap-5 justify-center self-stretch px-5 pt-4 pb-2.5 my-auto text-base leading-7 bg-white rounded-lg border border-white border-solid max-md:w-full max-md:mb-4">
                  <input
                    type="text"
                    placeholder="City, state, or zip"
                    className="flex-auto py-px"
                  />
                </div>
                <button
                  onClick={() => console.log("Search logic here")}
                  className="px-10 py-4 bg-[#3D52A1] text-white hover:bg-[7191E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6">
        <FilterMenu
          allSpecialists={allSpecialists}
          allLocations={allLocations}
          selectedSpecialists={selectedSpecialists}
          setSelectedSpecialists={setSelectedSpecialists}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <DoctorCards
          currentDoctors={currentDoctors}
          handleViewProfile={handleViewProfile}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      <Footer />
    </>
  );
};

export default DoctorList;
