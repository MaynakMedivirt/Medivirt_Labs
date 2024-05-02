import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Header from './Header';
import Footer from './Footer';
import { FaSearch } from 'react-icons/fa';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const db = getFirestore();
        const companiesCollection = collection(db, 'companies');
        const snapshot = await getDocs(companiesCollection);
        const companiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompanies(companiesData);
      } catch (error) {
        setError('Error fetching companies: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const allIndustries = [
    'Cardiologist', 'Dermatologist', 'Endocrinologist', 'Pediatrician', 'Neuromedicine',
    'Neurosurgery', 'Urogoly', 'Urosurgery', 'Chest Medicine', 'ENT (Otorhinolaryngology)',
    'Orthopedic Surgeon', 'Ophthalmologist', 'Gastroenterologist', 'Psychiatrist', 'Oncologist',
    'General Surgeon'
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedIndustries.length === 0 || selectedIndustries.includes(company.industry))
  );

  const totalPages = Math.ceil(filteredCompanies.length / 12);
  const startIndex = (currentPage - 1) * 12;
  const endIndex = Math.min(startIndex + 12, filteredCompanies.length);
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
      <section className="bg-gray-200 rounded-xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">Explore Companies</h1>
          <p className="text-lg md:text-xl font-medium mb-4">Discover companies across various industries!</p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => console.log('Search logic here')}
            className="px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            <FaSearch />
          </button>
        </div>
      </section>
      <div className="container mx-auto mt-10 flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/4 px-4 xl:"> {/* This div will take 1/4th of the width on large screens */}
          <div className="bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-2">Filter By Industry</h2>
            <ul>
              <li
                className={`cursor-pointer mb-2 ${selectedIndustries.length === 0 && 'font-semibold'}`}
                onClick={() => setSelectedIndustries([])}
              >
                <input
                  type="checkbox"
                  checked={selectedIndustries.length === 0}
                  onChange={() => setSelectedIndustries([])}
                  className="mr-2 cursor-pointer"
                />
                All
              </li>
              {allIndustries.map((industry, index) => (
                <li
                  key={index}
                  className={`cursor-pointer mb-2 ${selectedIndustries.includes(industry) && 'font-semibold'}`}
                  onClick={() => setSelectedIndustries(prev => [...prev, industry])}
                >
                  <input
                    type="checkbox"
                    checked={selectedIndustries.includes(industry)}
                    onChange={() => setSelectedIndustries(prev => [...prev, industry])}
                    className="mr-2 cursor-pointer"
                  />
                  {industry}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full lg:w-3/4 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCompanies.map((company, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  {company.image ? (
                    <img src={company.image} alt={`Profile of ${company.name}`} className="w-24 h-24 rounded-full" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      {/* Placeholder image */}
                      <img src="/src/assets/img/defaultAvatar.png" alt="Default Avatar" />
                    </div>
                  )}
                </div>
                <div className="text-lg font-semibold mb-2 flex items-center justify-center">{company.name}</div>
                <div className="text-gray-500 mb-2 flex items-center justify-center">{company.industry}</div>
                <a href={`/company/${company.id}`} className="bg-[#333333] hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
                View Details
              </a>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {currentPage > 1 && (
              <button
                onClick={previousPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Previous Page
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={nextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
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