import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import MedivirtLogo from '../../assets/img/Medivirt.png';
import Image from "../../assets/img/defaultAvatar.png";
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase';
import '../style/Doctor.css';

const DoctorNavbar = () => {
    const [doctor, setDoctor] = useState(null);
    const { id } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "doctors", id);
                const doctorSnapshot = await getDoc(docRef);
                if (doctorSnapshot.exists()) {
                    setDoctor({ id: doctorSnapshot.id, ...doctorSnapshot.data() });
                } else {
                    console.log("No such doctor");
                }
            } catch (error) {
                console.log("Error fetching doctor :", error);
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

    return (
        <nav className="bg-[#3D52A1] border-b w-full fixed top-0 left-0">
            <div className="flex items-center justify-between py-3 px-6">
                <NavLink to="/" className="flex-shrink-0">
                    <img id="navlogo" className="h-8" alt="Medivirt" src={MedivirtLogo} />
                </NavLink>
                <div className="flex items-center space-x-4">
                    <button id="doctorimg" className="w-10 h-10 outline-none rounded-full">
                        {doctor?.image ? (
                            <img
                                src={doctor.image}
                                alt={`Profile of ${doctor.name}`}
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
                        <p className="font-bold">{doctor?.name || "Loading..."}</p>
                        <p className="text-sm">Admin</p>
                    </div>
                    <button id="docdropdown" className="w-7 h-7 text-white border rounded-full" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <MdOutlineKeyboardArrowDown size={24} id="docicon"/>
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

export default DoctorNavbar;
