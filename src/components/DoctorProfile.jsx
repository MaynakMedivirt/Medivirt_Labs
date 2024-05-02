import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Header from './Header';
import Footer from './Footer';
import { FaCalendar, FaGraduationCap, FaLocationDot, FaStethoscope } from 'react-icons/fa6';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { MdOutlineScheduleSend } from "react-icons/md";

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const db = getFirestore();
        const doctorRef = doc(db, 'doctors', id);
        const doctorSnapshot = await getDoc(doctorRef);
        if (doctorSnapshot.exists()) {
          setDoctor({ id: doctorSnapshot.id, ...doctorSnapshot.data() });
        } else {
          console.log('No such doctor!');
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleContactMe = () => {
    if (doctor && doctor.email) {
      window.location.href = `mailto:${doctor.email}`;
    }
  };

  if (!doctor) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-0 xl:max-w-[200rem]">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row p-6 items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 rounded-full">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={`Profile of ${doctor.name}`}
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
              <h1 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{doctor.specialist}</p>
              <div className="flex items-center mb-2">
                <FaLocationDot className="text-gray-600 mr-2 w-5 h-5" />
                <p className="text-gray-600 mr-8">{doctor.location}</p>
                <FaCalendar className="text-gray-600 mr-2" />
                <p className="text-gray-600">{doctor.birthdate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Additional content */}
      <div className="flex flex-col md:flex-row mb-6 ">
        <div className="md:flex-1 md:order-2 mt-6 xl:max-w-[25rem]">
          <div className="p-6 md:p-5 md:h-auto bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Additional Details:</h2>
            <div className="flex items-center mb-2">
              <FaLocationDot className='h-6 w-6 mr-2' />
              <p className="text-md">Location: {doctor.location}</p>
            </div>
            <hr className='mb-3 border-gray-300'></hr>
            <div className="flex items-center mb-2">
              {doctor.gender && doctor.gender.toLowerCase() === 'male' ? (
                <IoMdMale className="h-6 w-6 mr-2 text-blue-500" />
              ) : (
                <IoMdFemale className="h-6 w-6 mr-2 text-pink-500" />
              )}
              <p className="text-md">Gender: {doctor.gender}</p>
            </div>
            <hr className='mb-3 border-gray-300'></hr>
            <div className="flex items-center mb-2">
              <FaStethoscope className='h-6 w-6 mr-2' />
              <span className="text-md mr-2">Specialist: {doctor.specialist}</span>
            </div>
            <hr className='mb-3 border-gray-300'></hr>
            <div className="flex items-center">
              <FaGraduationCap className='h-6 w-6 mr-2' />
              <span className="text-md mr-2">Qualification: {doctor.qualification}</span>
            </div>
            <hr className='mb-4 border-gray-300 mt-2'></hr>
            <div className="flex items-center justify-center">
              <button className='bg-[#333333] hover:bg-gray-500 text-white py-1 px-4 flex items-center'>
                <span className="mr-2">Schedule Meeting</span>
                <MdOutlineScheduleSend className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>
        <div className="md:flex-1 md:order-1 mt-6 md:mt-0">
          <div className="p-3 md:p-10 text-gray-700 md:w-[70rem]">
            <h2 className="text-xl font-semibold mb-2">About:</h2>
            <p className="text-lg">{doctor.aboutMe}</p>
          </div>
          <div className="p-3 md:p-10 text-gray-700 md:w-[70rem]">
            <h2 className="text-xl font-semibold mb-2">Education:</h2>
            <h3 className="text-lg font-medium mb-2">10th and 12th greade:</h3>
            <p className="text-lg">{doctor.e1}.</p>
          </div>
          <div className="p-3 md:p-10 text-gray-700 md:w-[70rem]">
            <h2 className="text-xl font-semibold mb-2">Experience:</h2>
            <h3 className="text-lg font-medium mb-2">10th and 12th greade:</h3>
            <p className="text-lg">{doctor.e1}.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorProfile;