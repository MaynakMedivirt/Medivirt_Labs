import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Header from "./Header";
import Footer from "./Footer";
import { FaSearch } from "react-icons/fa";
import defaultAvatar from "../assets/img/defaultAvatar.png";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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

  const allIndustries = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Pediatrician",
    "Neuromedicine",
    "Neurosurgery",
    "Urogoly",
    "Urosurgery",
    "Chest Medicine",
    "ENT (Otorhinolaryngology)",
    "Orthopedic Surgeon",
    "Ophthalmologist",
    "Gastroenterologist",
    "Psychiatrist",
    "Oncologist",
    "General Surgeon",
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedIndustries.length === 0 ||
        selectedIndustries.includes(company.industry))
  );

  const totalPages = Math.ceil(filteredCompanies.length / 24);
  const startIndex = (currentPage - 1) * 24;
  const endIndex = Math.min(startIndex + 24, filteredCompanies.length);
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

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
      <div className="flex flex-col items-center px-16 pt-6 bg-red-50 max-md:px-5">
        <div className="flex gap-5 justify-between items-start w-full max-w-[1176px] max-md:flex-wrap max-md:max-w-full mb-4">
          <div className="flex flex-col ml-[14rem] text-base text-neutral-800 max-md:max-w-full mb-4">
            <div className="text-4xl font-bold font-sans leading-8 max-md:max-w-full">
              Explore Companies
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 py-2.5 pr-2.5 pl-5 mt-6 bg-white rounded max-md:flex-wrap max-md:max-w-full">
              <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                <div className="flex flex-col justify-center self-stretch px-3 py-px my-auto border-r border-gray-200 border-solid">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by company name"
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
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-10 flex flex-col lg:flex-row items-start">
        <div className="w-full lg:w-1/4 px-4 bg-gray-100 py-4 ml-2 hidden md:block">
          <div className="text-2xl font-bold font-sans leading-8 mb-4">
            Filter By Industry
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={selectedIndustries.length === 0}
                onChange={() => setSelectedIndustries([])}
                className="cursor-pointer"
              />
              <span
                onClick={() => setSelectedIndustries([])}
                className="cursor-pointer"
              >
                All
              </span>
            </div>
            {allIndustries.map((industry, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={selectedIndustries.includes(industry)}
                  onChange={() =>
                    setSelectedIndustries((prev) =>
                      prev.includes(industry)
                        ? prev.filter((item) => item !== industry)
                        : [...prev, industry]
                    )
                  }
                  className="cursor-pointer"
                />
                <span
                  onClick={() =>
                    setSelectedIndustries((prev) =>
                      prev.includes(industry)
                        ? prev.filter((item) => item !== industry)
                        : [...prev, industry]
                    )
                  }
                  className="cursor-pointer"
                >
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-3/4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentCompanies.map((company, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow flex flex-col items-center text-center"
              >
                <img
                  loading="lazy"
                  src={company.logo || defaultAvatar}
                  alt={`Logo of ${company.name}`}
                  className="w-[90px] mt-3"
                />
                <div className="p-5">
                  <div className="text-sm font-bold leading-7 underline">
                    {company.name}
                  </div>
                  <div className="mt-3">
                    <div className="py-1 text-sm leading-9 bg-violet-100 max-md:px-5">
                      {company.industry}
                    </div>
                  </div>
                  <div className="mt-2 border-t border-gray-200 max-md:pr-5 max-md:pl-7">
                    <span className="text-sm">Location:</span>
                    <span className="text-sm">{company.location}</span>
                  </div>
                  <button
                    onClick={() => console.log("View company profile")}
                    className="px-2 py-1 mt-3 font-semibold text-white capitalize bg-indigo-800 tracking-[2px] max-md:px-5 hover:bg-indigo-600"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-start pl-5 mt-4 mb-4 overflow-x-auto">
            {currentPage > 1 && (
              <button
                onClick={previousPage}
                className="px-3 py-2 bg-white text-neutral-800 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
              >
                Previous Page
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={nextPage}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Next Page
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyList;
