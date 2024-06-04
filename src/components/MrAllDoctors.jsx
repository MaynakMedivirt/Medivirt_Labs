import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import MrSide from './MrSide';
import MrNavbar from './MrNavbar';
import defaultAvatar from "../assets/img/defaultAvatar.png";
import { useNavigate, useParams } from "react-router-dom";

const MrAllDoctors = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(20); 
    const [nameFilter, setNameFilter] = useState("");
    const [specialistFilter, setSpecialistFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchDoctors = async () => {
            try {
                const db = getFirestore();
                const doctorsCollection = collection(db, "doctors");
                const snapshot = await getDocs(doctorsCollection);
                const doctorsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDoctors(doctorsData);
                setFilteredDoctors(doctorsData);
            } catch (error) {
                setError("Error fetching doctors: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = doctors.filter((doctor) => {

                const nameMatch = doctor.name.toLowerCase().includes(nameFilter.toLowerCase());

                const specialistMatch = specialistFilter === "All" || doctor.specialist === specialistFilter;

                const locationMatch = locationFilter === "All" || doctor.location === locationFilter;

                return nameMatch && specialistMatch && locationMatch;
            });

            setFilteredDoctors(filtered);
        };

        applyFilters();
    }, [nameFilter, specialistFilter, locationFilter, doctors]);

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleViewProfile = (doctorId, id) => {
        navigate(`/mr/viewProfile/${id}`, { state: { doctorId } });
    }

    return (
        <div className="flex flex-col h-screen">
            <MrNavbar />
            <div className="flex flex-1">
                <MrSide open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10 overflow-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Doctors</h2>
                            <div className="flex space-x-4">
                                <input type="text" placeholder="Search by name" className="px-4 py-2 border border-gray-300 rounded-lg" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                                <select className="px-4 py-2 border border-gray-300 rounded-lg" value={specialistFilter} onChange={(e) => setSpecialistFilter(e.target.value)}>
                                    <option value="All">All Specializations</option>
                                    <option value="Orthopaedic">Orthopaedic</option>
                                    <option value="Cardiologist">Cardiologist</option>
                                    <option value="Gynaecologist">Gynaecologist</option>
                                    <option value="Radiologist">Radiologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Urology">Urology</option>
                                    <option value="Ophthalmology">Ophthalmology</option>
                                    <option value="Paediatric">Paediatric</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-lg" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                                    <option value="All">All Locations</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {loading && <div>Loading...</div>}
                            {error && <div>Error: {error}</div>}
                            {currentDoctors.map((doctor) => (
                                <div key={doctor.id} className="bg-white border border-gray-200  shadow flex flex-col items-center text-center">
                                    <img
                                        loading="lazy"
                                        src={doctor.image || defaultAvatar}
                                        alt={`Profile of ${doctor.name}`}
                                        className="items-center aspect-square w-[90px] mt-3 rounded-full"
                                    />
                                    <div className="p-5">
                                        <div className="self-center text-sm font-bold leading-7 underline">
                                            {doctor.name}
                                        </div>
                                        <div className="mt-3">
                                            <div className="justify-center py-1 text-sm leading-9 bg-violet-100 max-md:px-5">
                                                {doctor.specialist}
                                            </div>
                                        </div>
                                        <div className="justify-center leading-7 mt-2 border-t border-gray-200 border-solid max-md:pr-5 max-md:pl-7">
                                            <span className="">Location:</span>
                                            <span className="">{doctor.location}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewProfile(doctor.id, id)}
                                            className="justify-center px-2 py-1 mt-3 font-semibold text-white capitalize bg-indigo-800 tracking-[2px] max-md:px-5 hover:bg-indigo-600"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex mt-4">
                            {[...Array(Math.ceil(filteredDoctors.length / doctorsPerPage)).keys()].map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number + 1)}
                                    className={`px-4 py-2 ${currentPage === number + 1 ? "bg-indigo-400 text-white" : "bg-white border text-neutral-800"} rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1`}
                                >
                                    {number + 1}
                                </button>
                            ))}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
                            {`Showing ${currentDoctors.length} out of ${filteredDoctors.length} matches`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MrAllDoctors;
