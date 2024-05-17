import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";
import MedivirtLogo from '../assets/img/Medivirt.png';
import Image from "../assets/img/defaultAvatar.png";
import { signOut } from 'firebase/auth'; 
import { auth } from '../components/firebase';

const CompanyNavbar = () => {

    const [company, setCompany] = useState(null);
    const { id } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "companies", id);
                const companySnapshot = await getDoc(docRef);
                if (companySnapshot.exists()) {
                    setCompany({ id: companySnapshot.id, ...companySnapshot.data() });
                } else {
                    console.log("No such Company");
                }
            } catch (error) {
                console.log("Error fetching company :", error);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleLogout = () => {
        signOut(auth)
          .then(() => {
            console.log('User logged out successfully.');
            navigate('/login');
          })
          .catch(error => {
            console.error('Error logging out:', error);
          });
      };


    if (!company) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <nav className="bg-[#3D52A1] border-b w-full sticky top-0 left-0">
            <div className="flex items-center justify-between py-3 px-6">
                <NavLink to="/" className="flex-shrink-0">
                    <img className="h-8" alt="Medivirt" src={MedivirtLogo} />
                </NavLink>
                <div className="flex items-center space-x-4">
                    <button className="w-10 h-10 outline-none rounded-full">
                        {company.image ? (
                            <img
                                src={company.image}
                                alt={`Profile of ${company.name}`}
                                className="w-full h-full rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 outline-none rounded-full">
                                {/* Placeholder image */}
                                <img src={Image} className='w-full h-full rounded-full' alt="User Profile" />
                            </div>
                        )}
                    </button>
                    <div className="text-white">
                        <p className="font-bold">{company.name}</p>
                        <p className="text-sm">{company.companyName}</p>
                    </div>
                    <button className="w-7 h-7 text-white border rounded-full" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <MdOutlineKeyboardArrowDown size={24} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded shadow z-10">
                            <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default CompanyNavbar;
