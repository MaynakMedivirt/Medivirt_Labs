import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // Number of items per page
  const navigate = useNavigate();
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

  const indexOfLastDoctor = currentPage * perPage;
  const indexOfFirstDoctor = indexOfLastDoctor - perPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

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
        <td className="px-6 py-4">{doctor.email}</td>
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

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(doctors.length / perPage); i++) {
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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5">
              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                <tr>
                  <th scope="col" className="text-lg px-6 py-3">
                    S.N.
                  </th>
                  <th
                    scope="col"
                    className="text-lg px-6 py-3 bg-gray-50 dark:bg-gray-800"
                  >
                    Name
                  </th>
                  <th scope="col" className="text-lg px-6 py-3">
                    Email
                  </th>
                  <th
                    scope="col"
                    className="text-lg px-6 py-3 bg-gray-50 dark:bg-gray-800"
                  >
                    Specialist
                  </th>
                  <th scope="col" className="text-lg px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>{renderDoctors}</tbody>
            </table>
            <div>{renderPageNumbers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
