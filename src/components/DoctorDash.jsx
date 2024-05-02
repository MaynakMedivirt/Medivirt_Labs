import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import 'firebase/storage';
import { FaRegCalendarCheck } from "react-icons/fa";
import { HiInboxArrowDown } from "react-icons/hi2";

import Navbar from './Navbar';
import Side from './Side';

import { firebaseConfig } from '../components/firebase';

const app = initializeApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const DoctorDash = () => {
  const { currentUser } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!currentUser) return;

      try {
        const db = getFirestore();
        const doctorRef = doc(db, 'doctors', currentUser.uid);
        const doctorSnapshot = await getDoc(doctorRef);

        if (doctorSnapshot.exists()) {
          const data = doctorSnapshot.data();
          setDoctorData(data);
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setQualification(data.qualification || '');
          setSpecialist(data.specialist || '');
          setAboutMe(data.aboutMe || '');
          if (data.image) {
            setImageUrl(data.image);
          }
        } else {
          setIsCompletingProfile(true);
        }
      } catch (error) {
        setError('Error fetching doctor profile: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const doctorRef = doc(db, 'doctors', currentUser.uid);
      const dataToUpdate = { name, email, phone, qualification, specialist, aboutMe };
      if (imageUrl) {
        dataToUpdate.image = imageUrl;
      }
      await setDoc(doctorRef, dataToUpdate);
      setDoctorData({ ...dataToUpdate });
      setIsEditingProfile(false);

      // Reload the page after updating profile
      window.location.reload();
    } catch (error) {
      setError('Error saving doctor profile: ' + error.message);
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
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex">
        <Side />
        <div className="flex-1">
          <Navbar />
          <div className="container max-w-6xl px-5 mx-auto my-10">
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-100 shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-rose-50 rounded-full w-12 h-12 text-rose-300 flex justify-center items-center">
                    <HiInboxArrowDown className='h-6 w-6'/>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Messages</div>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-emerald-50 rounded-full w-12 h-12 text-emerald-300 flex justify-center items-center">
                    <FaRegCalendarCheck className='h-6 w-6'/>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Scheduled Meetings</div>
                    <div className="text-2xl font-bold text-gray-900">6</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-fuchsia-50 rounded-full w-12 h-12 text-fuchsia-400 flex justify-center items-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Sales</div>
                    <div className="text-2xl font-bold text-gray-900">$9850.90</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 shadow-sm rounded p-5">
                <div className="flex space-x-4 items-center">
                  <div>
                    <div className="bg-fuchsia-50 rounded-full w-12 h-12 text-fuchsia-400 flex justify-center items-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Sales</div>
                    <div className="text-2xl font-bold text-gray-900">$9850.90</div>
                  </div>
                </div>
              </div>

              {/* Add more cards here with similar structure */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDash;