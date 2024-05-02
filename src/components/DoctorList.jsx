import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { FaSearch } from 'react-icons/fa';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage drawer visibility
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const db = getFirestore();
        const doctorsCollection = collection(db, 'doctors');
        const snapshot = await getDocs(doctorsCollection);
        const doctorsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDoctors(doctorsData);
      } catch (error) {
        setError('Error fetching doctors: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleViewProfile = (doctor) => {
    if (currentUser && currentUser.emailVerified) {
      navigate(`/doctor/${doctor.id}`);
    } else {
      setShowSignInMessage(true);
      setTimeout(() => {
        setShowSignInMessage(false);
        navigate('/login');
      }, 3000);
    }
  };

  const allSpecialists = [
    'Cardiologist', 'Dermatologist', 'Endocrinologist', 'Pediatrician', 'Neuromedicine',
    'Neurosurgery', 'Urogoly', 'Urosurgery', 'Chest Medicine', 'ENT (Otorhinolaryngology)',
    'Orthopedic Surgeon', 'Ophthalmologist', 'Gastroenterologist', 'Psychiatrist', 'Oncologist',
    'General Surgeon'
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedSpecialists.length === 0 || selectedSpecialists.includes(doctor.specialist))
  );

  const totalPages = Math.ceil(filteredDoctors.length / 12);
  const startIndex = (currentPage - 1) * 12;
  const endIndex = Math.min(startIndex + 12, filteredDoctors.length);
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Header />
      {showSignInMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-2">You need to sign in to view doctor profiles.</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
            <img className="w-10 h-10 animate-spin text-[#3d] mx-auto mt-5" src="https://www.svgrepo.com/show/448500/loading.svg" alt="Loading icon" />
          </div>
        </div>
      )}

      {/* Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white w-full md:w-3/4 max-h-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter By Specialist</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-600 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedSpecialists.length === 0}
                  onChange={() => setSelectedSpecialists([])}
                  className="cursor-pointer"
                />
                <span onClick={() => setSelectedSpecialists([])} className="cursor-pointer">All</span>
              </div>
              {allSpecialists.map((specialist, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={selectedSpecialists.includes(specialist)}
                    onChange={() =>
                      setSelectedSpecialists(prev =>
                        prev.includes(specialist)
                          ? prev.filter(item => item !== specialist)
                          : [...prev, specialist]
                      )
                    }
                    className="cursor-pointer"
                  />
                  <span
                    onClick={() =>
                      setSelectedSpecialists(prev =>
                        prev.includes(specialist)
                          ? prev.filter(item => item !== specialist)
                          : [...prev, specialist]
                      )
                    }
                    className="cursor-pointer"
                  >
                    {specialist}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* top section */}
      <div className="flex flex-col items-center px-16 pt-6 bg-red-50 max-md:px-5">
        <div className="flex gap-5 justify-between items-start w-full max-w-[1176px] max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col self-start text-base text-neutral-800 max-md:max-w-full mb-4">
            <div className="text-4xl font-bold leading-8 max-md:max-w-full">
              Find Your Doctor Here
            </div>
            <div className="mt-9 leading-[131%] max-md:max-w-full">
              All the Lorem Ipsum generators on the Internet tend to repeat.
            </div>
            <div className="flex gap-2.5 justify-end items-center py-2.5 pr-2.5 pl-5 mt-6 bg-white rounded max-md:flex-wrap max-md:max-w-full">

              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center self-stretch px-3 py-px my-auto border-r border-gray-200 border-solid">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name"
                    className="px-4 py-4 border-gray-300 rounded-md max-md:w-[200px]"
                  />
                </div>
                <div className="flex gap-5 justify-center self-stretch px-5 pt-4 pb-2.5 my-auto text-base leading-7 bg-white rounded-lg border border-white border-solid">
                  <input
                    type="text"
                    placeholder="City, state, or zip"
                    className="flex-auto py-px"
                  />
                  <div className="w-2 h-5 bg-gray-400" />
                </div>
                <button
                  onClick={() => console.log('Search logic here')}
                  className="px-10 py-4 bg-[#3D52A1] text-white  hover:bg-[7191E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-10 flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/4 px-4 hidden md:block">
          <div className="bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-2">Filter By Specialist</h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedSpecialists.length === 0}
                  onChange={() => setSelectedSpecialists([])}
                  className="cursor-pointer"
                />
                <span onClick={() => setSelectedSpecialists([])} className="cursor-pointer">All</span>
              </div>
              {allSpecialists.map((specialist, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={selectedSpecialists.includes(specialist)}
                    onChange={() =>
                      setSelectedSpecialists(prev =>
                        prev.includes(specialist)
                          ? prev.filter(item => item !== specialist)
                          : [...prev, specialist]
                      )
                    }
                    className="cursor-pointer"
                  />
                  <span
                    onClick={() =>
                      setSelectedSpecialists(prev =>
                        prev.includes(specialist)
                          ? prev.filter(item => item !== specialist)
                          : [...prev, specialist]
                      )
                    }
                    className="cursor-pointer"
                  >
                    {specialist}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-3/4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDoctors.map((doctor, index) => (
              <div key={index} className="flex flex-col grow px-7 pt-8 pb-16 w-full text-base font-medium text-center bg-white rounded border border-gray-200 border-solid text-neutral-800 max-md:px-5 max-md:mt-8 shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                <img
                  loading="lazy"
                  src={doctor.image || "/src/assets/img/defaultAvatar.png"}
                  alt={`Profile of ${doctor.name}`}
                  className="self-center aspect-square w-[90px] rounded-full"
                />
                <div className="self-center mt-7 text-lg leading-7 underline">{doctor.name}</div>
                <div className="self-center mt-3 leading-[162%] text-zinc-500">{doctor.specialist}</div>
                <div className="justify-center px-9 py-3 mt-4 text-sm leading-9 bg-violet-100 max-md:px-5">
                  {doctor.specialist}
                </div>
                <div className="justify-center items-start px-16 py-6 mt-5 leading-7 border-t border-gray-200 border-solid max-md:pr-5 max-md:pl-7">
                  <span className="">Location:</span>
                  <br />
                  <span className="">{doctor.location}</span> {/* Assuming each doctor object has a location property */}
                </div>
                <button
                  onClick={() => handleViewProfile(doctor)}
                  className="justify-center px-14 py-6 mt-3 font-semibold text-white capitalize bg-indigo-800 tracking-[2px] max-md:px-5 hover:bg-indigo-600"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-start pl-5 mt-4 mb-4 overflow-x-auto">
            {currentPage > 5 && (
              <button
                onClick={() => {
                  setCurrentPage(currentPage - 5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 bg-white text-neutral-800 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
              >
                &lt;
              </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              (index >= currentPage - 3 && index < currentPage + 2) && (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 ${currentPage === index + 1
                    ? 'bg-indigo-400 text-white'
                    : 'bg-white text-neutral-800'
                    } rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1`}
                >
                  {index + 1}
                </button>
              )
            ))}
            {currentPage <= totalPages - 5 && (
              <button
                onClick={() => {
                  setCurrentPage(currentPage + 5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 bg-white text-neutral-800 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ml-2"
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorList;