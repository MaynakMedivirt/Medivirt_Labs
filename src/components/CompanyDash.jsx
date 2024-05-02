import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import 'firebase/storage'; 
import defaultAvatar from '../assets/img/defaultAvatar.png'; // Import default avatar image
import { CircularProgress } from '@mui/material'; // Import CircularProgress from Material UI

import { firebaseConfig } from '../components/firebase';

const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const CompanyDash = () => {
  const { currentUser } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [aboutUs, setAboutUs] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!currentUser) return;

      try {
        const db = getFirestore();
        const companyRef = doc(db, 'companies', currentUser.uid);
        const companySnapshot = await getDoc(companyRef);

        if (companySnapshot.exists()) {
          const data = companySnapshot.data();
          setCompanyData(data);
          if (data.image) {
            setImageUrl(data.image);
          }
        } else {
          setIsCompletingProfile(true);
        }
      } catch (error) {
        setError('Error fetching company profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const companyRef = doc(db, 'companies', currentUser.uid);
      const dataToUpdate = { name, email, phone, industry, aboutUs }; 
      if (imageUrl) dataToUpdate.image = imageUrl;
      await setDoc(companyRef, dataToUpdate);
      setCompanyData({ ...dataToUpdate });
      setIsEditingProfile(false);
    } catch (error) {
      setError('Error saving company profile: ' + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${currentUser.uid}/${file.name}`);
    try {
      // Upload file to Firebase Storage
      const uploadTaskSnapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const url = await getDownloadURL(uploadTaskSnapshot.ref);
      
      // Update the imageUrl state with the new URL
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (isCompletingProfile || isEditingProfile) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">
          {isCompletingProfile ? 'Complete Your Profile' : 'Edit Your Profile'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700">Company Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input mt-1 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input mt-1 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input mt-1 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Industry:</label> 
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="form-input mt-1 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">About Us:</label> 
            <textarea
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              className="form-textarea mt-1 block w-full border rounded-md"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Company Logo:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
            {isCompletingProfile ? 'Save Profile' : 'Update Profile'}
          </button>
        </form>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <p className="text-gray-600 text-lg mb-4">No company profile available</p>
        <Link to="/complete-profile" className="text-blue-500 hover:underline block">
          Complete your profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Welcome, {companyData.name}</h2>
        <button
          onClick={() => setIsEditingProfile(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
        >
          Edit Profile
        </button>
      </div>
      <div className="mb-4">
        <img
          src={imageUrl || defaultAvatar}
          alt="Company Logo"
          className="w-32 h-32 rounded-full mx-auto"
          />
      </div>
      <h3 className="text-lg font-semibold mt-4">Details:</h3>
      <p className="text-gray-600 mb-2">Email: {companyData.email}</p>
      <p className="text-gray-600 mb-2">Phone: {companyData.phone}</p>
      <p className="text-gray-600 mb-2">Industry: {companyData.industry}</p>
      {companyData.aboutUs && (
        <div>
          <h3 className="text-lg font-semibold mt-4">About Us:</h3>
          <p className="text-gray-600">{companyData.aboutUs}</p>
        </div>
      )}
    </div>
);
};

export default CompanyDash;