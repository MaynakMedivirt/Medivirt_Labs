import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { MdOutlineLocationOn } from 'react-icons/md';
import Header from './Header';
import Footer from './Footer';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const db = getFirestore();
        const companyRef = doc(db, 'companies', id); // Assuming 'companies' is your collection name
        const companySnapshot = await getDoc(companyRef);
        if (companySnapshot.exists()) {
          setCompany({ id: companySnapshot.id, ...companySnapshot.data() });
        } else {
          console.log('No such company!');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleContactUs = () => {
    if (company && company.email) {
      window.location.href = `mailto:${company.email}`;
    }
  };

  if (!company) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-8 px-4 md:px-0 xl:max-w-[200rem]">
        <div className="bg-[#ffede9] rounded-lg overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row p-6 items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-full">
            {company.image ? (
                <img
                  src={company.image}
                  alt={`Profile of ${company.name}`}
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full"
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* Placeholder image */}
                  <img src="../src/assets/img/defaultAvatar.png" alt="Placeholder" />
                </div>
              )}
            </div>
            <div className="px-6 md:flex-grow">
              <h1 className="text-xl font-semibold text-gray-800 mb-2">{company.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
              <div className="flex items-center mb-2">
                <MdOutlineLocationOn className="text-gray-600 mr-2 w-5 h-5" />
                <p className="text-gray-600 mr-8">{company.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional content */}
      <div className="flex flex-col md:flex-row mb-6">
        <div className="md:flex-1 md:order-2 mt-6">
          <div className="p-6 md:p-5 md:h-auto bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Company Details:</h2>
            <p className="text-md">Location: {company.location}</p>
            <p className="text-md">Industry: {company.industry}</p>
            <p className="text-md">Founded: {company.founded}</p>
            {/* Add more relevant company details */}
          </div>
        </div>
        <div className="md:flex-1 md:order-1 mt-6 md:mt-0">
          <div className="p-3 md:p-10 text-gray-700 md:w-[70rem]">
            <h2 className="text-xl font-semibold mb-2">About:</h2>
            <p className="text-lg">{company.about}</p>
          </div>
          <div className="p-3 md:p-10 text-gray-700">
            <h2 className="text-xl font-semibold mb-2">Mission & Vision:</h2>
            <p className="text-lg">{company.mission}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;