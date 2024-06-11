import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CompanyFM from "../pages/CompanyFM"; // Updated filter menu for companies
import CompanyCards from "../pages/CompanyCards"; // Component to display company cards

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleViewProfile = (company) => {
    navigate(`/company/${company.id}`);
  };

  const allIndustries = [
    "Orthopaedic",
    "Cardiologist",
    "Gynaecologist",
    "Radiologist",
    "Dermatologist",
    "Oncology",
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

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedIndustries.length === 0 ||
        selectedIndustries.includes(company.industry)) &&
      (selectedLocations.length === 0 ||
        selectedLocations.includes(company.location))
  );

  const totalPages = Math.ceil(filteredCompanies.length / 24);
  const startIndex = (currentPage - 1) * 24;
  const endIndex = Math.min(startIndex + 24, filteredCompanies.length);
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  return (
    <>
      <Header />

      <div className="flex flex-col items-center px-16 pt-6 bg-red-50 max-md:px-5">
        <div
          id="companylist"
          className="flex gap-5 justify-between items-center w-full max-w-[1176px] max-md:flex-wrap max-md:max-w-full"
        >
          <div
            id="companytitle"
            className="capitalize text-4xl font-bold font-sans leading-8 max-md:max-w-full lg:mb-4"
          >
            Explore Companies
          </div>
          <div
            id="companydiv"
            className="flex flex-col text-base text-neutral-800 max-md:max-w-full mb-4"
          >
            <div
              id="companyinput"
              className="flex items-center gap-2.5 bg-white rounded max-md:flex-wrap max-md:max-w-full"
            >
              <div
                id="centerdiv"
                className="flex items-center gap-2 max-md:flex-col max-md:items-start"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="py-4 px-3 border-gray-300 rounded-md max-md:w-[200px]"
                />
                <input
                  type="text"
                  placeholder="City, state, or zip"
                  className="py-4 px-3 border-gray-300 rounded-md max-md:w-full"
                />
                <button
                  onClick={() => console.log("Search logic here")}
                  className="px-10 py-4 bg-[#3D52A1] text-white hover:bg-[#7191E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-6">
        <CompanyFM
          allIndustries={allIndustries}
          allLocations={allLocations}
          selectedIndustries={selectedIndustries}
          setSelectedIndustries={setSelectedIndustries}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <CompanyCards
          currentCompanies={currentCompanies}
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

export default CompanyList;
