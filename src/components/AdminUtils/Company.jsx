import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc, query, where, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaRegEdit, FaCreditCard } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25); // Number of items per page
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreditBox, setShowCreditBox] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [consumedCredits, setConsumedCredits] = useState(0);
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const db = getFirestore();
        const companiesCollection = collection(db, "companies");
        const snapshot = await getDocs(companiesCollection);
        const companiesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompanies(companiesData);
      } catch (error) {
        setError("Error fetching companies: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchCompletedMeetings(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompletedMeetings = async (companyId) => {
    try {
      const db = getFirestore();
      const meetingRef = collection(db, "scheduleMeeting");
      const q = query(meetingRef, where("companyID", "==", companyId), where("status", "==", "completed"));
      const querySnapshot = await getDocs(q);
      setConsumedCredits(querySnapshot.size);

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

      const completedMeetingsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const meetingData = doc.data();
          const doctorData = await fetchDoctorData(meetingData.doctorID);
          const companyData = await fetchCompanyData(meetingData.companyID);
          return {
            id: doc.id,
            ...meetingData,
            doctorName: doctorData ? doctorData.name : "Unknown Doctor",
            companyName: companyData ? companyData.companyName : "Unknown Company",
            representativeName: companyData ? companyData.name : "Unknown Company",
          };
        })
      );

      setCompletedMeetings(completedMeetingsData);
      console.log(completedMeetingsData);
    } catch (error) {
      console.error("Error fetching completed meetings:", error);
    }
  };

  const handleEditProfile = (companyId) => {
    navigate(`/admin/edit-company/${companyId}`);
  };

  const handleDeleteProfile = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );

    if (confirmed) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "companies", companyId));
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== companyId)
        );
      } catch (error) {
        console.error("Error deleting company profile:", error);
      }
    }
  };

  const handleAddCredits = async () => {
    const { value: newCredits } = await Swal.fire({
      title: 'Enter new credits',
      input: 'number',
      inputLabel: 'Number of credits to add',
      inputPlaceholder: 'Enter number of credits',
      showCancelButton: true,
    });
  
    if (newCredits) {
      const additionalCredits = parseInt(newCredits);
      const updatedTotalCredits = totalCredits + additionalCredits; // Update total credits
  
      // Update the credits for the selected company only
      const updatedCompanies = companies.map((company) => {
        if (company.id === selectedCompany) {
          return {
            ...company,
            credits: (company.credits || 0) + additionalCredits,
          };
        }
        return company;
      });
  
      setTotalCredits(updatedTotalCredits); // Update total credits state
      setCompanies(updatedCompanies); // Update companies state
  
      // Update Firestore if needed
      try {
        const db = getFirestore();
        const companyDocRef = doc(db, "companies", selectedCompany);
        const companyDocSnapshot = await getDoc(companyDocRef);
  
        if (companyDocSnapshot.exists()) {
          const currentCredits = companyDocSnapshot.data().credits || 0; // Get current credits from Firestore
          const totalNewCredits = currentCredits + additionalCredits; // Add new credits to existing credits
          await updateDoc(companyDocRef, { credits: totalNewCredits }); // Update Firestore with new total credits
        }
      } catch (error) {
        console.error("Error updating credits:", error);
      }
    }
  };
  

  const handleCreditButtonClick = async (companyId) => {
    setSelectedCompany(companyId);
    setShowCreditBox(!showCreditBox);
    try {
      const db = getFirestore();
      const companyDocRef = doc(db, "companies", companyId);
      const companyDocSnapshot = await getDoc(companyDocRef);
  
      if (companyDocSnapshot.exists()) {
        const companyData = companyDocSnapshot.data();
        const totalCreditsFromDB = companyData.credits || 0;
        const availableCreditsFromDB = totalCreditsFromDB - consumedCredits;
  
        setTotalCredits(totalCreditsFromDB);
        setAvailableCredits(availableCreditsFromDB);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
    await fetchCompletedMeetings(companyId);
  };

  const handleCancelClick = () => {
    setShowCreditBox(false);
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCompany = filteredCompanies.map((company, index) => (
    <tr
      className="border-b border-gray-200 dark:border-gray-700"
      key={company.id}
    >
      <td scope="row" className="px-6 py-4">
        {index + 1 + (currentPage - 1) * perPage}
      </td>
      <td
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
      >
        {company.companyName}
      </td>
      <td className="px-6 py-4">
        {company.name}
      </td>
      <td className="px-6 py-4 bg-gray-50">
        {company.location}
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
        >
          <FaEye />
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
          onClick={() => handleEditProfile(company.id)}
        >
          <FaRegEdit />
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
          onClick={() => handleDeleteProfile(company.id)}
        >
          <MdDelete />
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
          onClick={() => handleCreditButtonClick(company.id)}
        >
          <FaCreditCard />
        </button>
      </td>
    </tr>
  ));

  const totalPages = Math.ceil(filteredCompanies.length / perPage);

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

  return (
    <div className="flex">
      <AdminSide />
      <div className="flex-1 overflow-hidden">
        <AdminNavbar />
        <div className="container mx-auto px-5 md:px-3 h-full overflow-y-scroll overflow-x-scroll">
          <div className="border mt-4 p-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-center text-3xl font-bold">Company List</h2>
              <Link
                to="/admin/add-company"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Company
              </Link>
            </div>
            <div className="flex justify-end items-center py-2.5 pr-2.5 pl-5 mt-6 bg-white rounded max-md:flex-wrap max-md:max-w-full">
              <div className="flex items-center">
                <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Company or Name"
                    className="p-2"
                  />
                </div>
                <button
                  onClick={() => console.log('Search logic here')}
                  className="p-2 rounded bg-[#11A798] text-white  hover:bg-[7191E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
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
                      className="px-6 py-3 bg-gray-50 text-sm uppercase tracking-wider"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-50 text-sm uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renderCompany}
                </tbody>
              </table>
            </div>
            <div>{renderPageNumbers}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
              {`Showing ${companies.length} out of ${filteredCompanies.length} matches`}
            </div>
          </div>
          {/* Credit Box */}
          {showCreditBox && (
            <div className="fixed top-1/2 left-1/2 overflow-y-auto overflow-x-auto transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg p-6 shadow-md max-w-[80%] max-h-[80%]">
              <h3 className="text-xl text-center font-bold mb-4 uppercase">Credits</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white border shadow-sm rounded p-5">
                  <div>
                    <div className="text-gray-400">Total</div>
                    <div className="text-2xl font-bold text-black">{totalCredits}</div>
                  </div>
                </div>
                <div className="bg-white border shadow-sm rounded p-5">
                  <div>
                    <div className="text-gray-400">Available</div>
                    <div className="text-2xl font-bold text-black">{availableCredits}</div>
                  </div>
                </div>
                <div className="bg-white border shadow-sm rounded p-5">
                  <div>
                    <div className="text-gray-400">Consumed</div>
                    <div className="text-2xl font-bold text-black">{consumedCredits}</div>
                  </div>
                </div>
                <div className="bg-white border shadow-sm rounded p-5">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleAddCredits}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              {/* Scheduled Meetings Table */}
              <h3 className="text-xl text-center font-bold mt-8 mb-4 uppercase">Completed Meetings</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-sm tracking-wider">SN</th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-sm uppercase tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-3 text-sm tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-sm uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedMeetings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No completed meetings found.</td>
                    </tr>
                  ) : (
                    completedMeetings.map((meeting, index) => (
                      <tr key={meeting.id} className="border-b border-gray-200">
                        <td scope="row" className="px-6 py-4">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          {meeting.doctorName}
                        </td>
                        <td className="px-6 py-4">{meeting.date}</td>
                        <td className="px-6 py-4 bg-gray-50">{meeting.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;
