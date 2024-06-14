import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";
import MedivirtLogo from '../../assets/img/Medivirt.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import "../style/Company.css";

const SalesNavbar = () => {

    const [user, setUser] = useState(null);
    const [companyName, setCompanyName] = useState(""); 
    const { id } = useParams();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const db = getFirestore();
                const docRef = doc(db, "users", id);
                const userSnapshot = await getDoc(docRef);
                if (userSnapshot.exists()) {
                    setUser({ id: userSnapshot.id, ...userSnapshot.data() });

                    if (userSnapshot.data().companyId) {
                        const companyId = userSnapshot.data().companyId;
                        const companyDocRef = doc(db, "companies", companyId);
                        const companySnapshot = await getDoc(companyDocRef);
                        if (companySnapshot.exists()) {
                            setCompanyName(companySnapshot.data());
                        }
                    }
                } else {
                    console.log("No such User");
                }
            } catch (error) {
                console.log("Error fetching User :", error);
            }
        };
        fetchUser();
    }, [id]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User logged out successfully.');
                navigate('/');
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <nav className="bg-[#3D52A1] border-b w-full fixed top-0 left-0">
            <div className="flex items-center justify-between py-3 px-6">
                <NavLink to="/" className="flex-shrink-0">
                    <img id="saleslogo" className="h-8" alt="Medivirt" src={MedivirtLogo} />
                </NavLink>
                <div className="flex items-center space-x-4">
                    {user && ( 
                        <div className="text-white">
                            <p id="salestext" className="font-bold">{user.firstName} {user.lastName}</p>
                            {companyName.companyName && <p id="salestext" className="text-sm">{companyName.companyName}</p>}
                        </div>
                    )}
                    <button id="salesbutton" className="w-7 h-7 text-white border rounded-full" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <MdOutlineKeyboardArrowDown size={24} id="salesicon" />
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

export default SalesNavbar;
