import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminSide from "./AdminSide";
import AdminNavbar from "./AdminNavbar";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25); // Number of items per page
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleViewProfile = (managerId) => {
  //   navigate(`/manager/${managerId}`);
  // };

  // const handleEditProfile = (managerId) => {
  //   navigate(`/edit-doctor/${managerId}`);
  // };

  const handleDeleteProfile = async (managerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile?"
    );

    // If the user confirms the action
    if (confirmed) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "companies", managerId));
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.id !== managerId)
        );
      } catch (error) {
        console.error("Error deleting company profile:", error);
      }
    }
  };

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }


  const indexOfLastCompany = currentPage * perPage;
  const indexOfFirstCompany = indexOfLastCompany - perPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);


  let serialNumber = indexOfFirstCompany + 1; 

  const renderCompany = currentCompanies.map((company) => {
    const sn = serialNumber++;
    return (

      <tr
        className="border-b border-gray-200 dark:border-gray-700"
        key={company.id}
      >
        <td scope="row" className="px-6 py-4">
          {sn}
        </td>{" "}
        {/* Add S.N. here */}
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
        >
          {company.companyName}
        </td>
        <td className="px-6 py-4">
          {company.name}
        </td>
        <td className="px-6 py-4">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
            // onClick={() => handleViewProfile(company.id)}
          >
            <FaEye />
          </button>
          <button
            type="button"
            className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2"
            // onClick={() => handleEditProfile(company.id)}
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
        </td>
      </tr>
    );
  });

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
              <h2 className="text-center text-3xl font-bold">Company List</h2>
              <Link
                to=""
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
                      className="px-6 py-3 text-sm uppercase tracking-wider"
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
                      className="px-6 py-3 text-sm uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">{renderCompany}</tbody>
              </table>
            </div>

            <div>{renderPageNumbers}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
              {`Showing ${currentCompanies.length} out of ${filteredCompanies.length} matches`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
