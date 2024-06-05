import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25); 
  const [nameFilter, setNameFilter] = useState("");
  const [specialistFilter, setSpecialistFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isAdminLoggedIn } = useAuth();


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

  useEffect(() => {
    const applyFilters = () => {
      let filtered = doctors.filter((doctor) => {

        const nameMatch = doctor.name.toLowerCase().includes(nameFilter.toLowerCase());

        const specialistMatch = specialistFilter === "All" || doctor.specialist === specialistFilter;

        const locationMatch = locationFilter === "All" || doctor.location === locationFilter;

        return nameMatch && specialistMatch && locationMatch;
      });

      setFilteredDoctors(filtered);
    };

    applyFilters();
  }, [nameFilter, specialistFilter, locationFilter, doctors]);

  // const uniqueSpecialists = [...new Set(doctors.map((doctor) => doctor.specialist))];

  // const filteredDoctors = doctors.filter((doctor) => {
  //   return (
  //     (doctor.name && doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //     (doctor.location && doctor.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //     (selectedSpecialist === '' || (doctor.specialist && doctor.specialist.toLowerCase() === selectedSpecialist.toLowerCase()))
  //   );
  // });


  const handleViewProfile = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const handleEditProfile = (doctorId) => {
    navigate(`/edit-doctor/${doctorId}`);
  };

  const handleDeleteProfile = async (doctorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );

    // If the user confirms the action
    if (confirmed) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "doctors", doctorId));
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.id !== doctorId)
        );
      } catch (error) {
        console.error("Error deleting doctor profile:", error);
      }
    }
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }


  const indexOfLastDoctor = currentPage * perPage;
  const indexOfFirstDoctor = indexOfLastDoctor - perPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);


  let serialNumber = indexOfFirstDoctor + 1; // Initialize serial number counter

  const renderDoctors = currentDoctors.map((doctor) => {
    const sn = serialNumber++;
    return (

      <tr
        className="border-b border-gray-200 dark:border-gray-700"
        key={doctor.id}
      >
        <td scope="row" className="px-6 py-4">
          {sn}
        </td>{" "}
        {/* Add S.N. here */}
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
        >
          {doctor.name}
        </td>
        <td className="px-6 py-4">{doctor.location}</td>
        <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
          {doctor.specialist}
        </td>
        <td className="px-6 py-4">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
            onClick={() => handleViewProfile(doctor.id)}
          >
            <FaEye />
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
            onClick={() => handleEditProfile(doctor.id)}
          >
            <FaRegEdit />
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
            onClick={() => handleDeleteProfile(doctor.id)}
          >
            <MdDelete />
          </button>
        </td>
      </tr>
    );
  });

  const totalPages = Math.ceil(filteredDoctors.length / perPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => (
    <button
      key={number}
      onClick={() => setCurrentPage(number)}
      className="my-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
    >
      <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        {number}
      </span>
    </button>
  ));

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1 overflow-hidden">
        <AdminNavbar />
        <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
          <div className="border mt-4 p-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-center text-3xl font-bold">Doctor List</h2>
              <Link
                to="/add-doctor"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Doctor
              </Link>

            </div>

            <div className="flex justify-end items-center py-2.5 pr-2.5 pl-5 mt-6 bg-white rounded max-md:flex-wrap max-md:max-w-full">

              <div className="flex flex-col justify-end sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <input
                  type="text"
                  placeholder="Search by name"
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                  value={specialistFilter}
                  onChange={(e) => setSpecialistFilter(e.target.value)}
                >
                  <option value="All">All Specializations</option>
                  <option value="Orthopaedic">Orthopaedic</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Gynaecologist">Gynaecologist</option>
                  <option value="Radiologist">Radiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Urology">Urology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Paediatric">Paediatric</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="All">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            <div className="overflow-auto mt-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm tracking-wider"
                    >
                      S.N.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Specialist
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">{renderDoctors}</tbody>
              </table>
            </div>

            <div>{renderPageNumbers}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
              {`Showing ${currentDoctors.length} out of ${filteredDoctors.length} matches`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
