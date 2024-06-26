import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import CompanySide from './CompanySide';
import CompanyNavbar from './CompanyNavbar';
import defaultAvatar from "../../assets/img/defaultAvatar.png";
import { useNavigate, useParams } from "react-router-dom";

const MyDoctors = () => {
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
    const { id } = useParams();
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
            setCurrentPage(1);
        };

        applyFilters();
    }, [nameFilter, specialistFilter, locationFilter, doctors]);
    
    const handleViewProfile = (doctorId, id) => {
        navigate(`/company/viewProfile/${id}`, { state: { doctorId } });
    }
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex mt-4">
                {currentPage > 1 && (
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className="px-4 py-2 bg-white border text-neutral-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1"
                    >
                        &lt;
                    </button>
                )}
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 ${currentPage === number ? "bg-indigo-400 text-white" : "bg-white border text-neutral-800"} rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1`}
                    >
                        {number}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="px-4 py-2 bg-white border text-neutral-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1"
                    >
                        &gt;
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen">
            <CompanyNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <CompanySide open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-20'}`}>
                    <div className="container px-4 mx-auto my-10 overflow-auto">

                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold bg-[#8697C4] text-white p-2 rounded mb-2 sm:mb-0 sm:mr-4 w-full sm:w-auto text-center sm:text-left">
                                Doctors
                            </h2>
                            <div className="flex flex-col justify-end sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                />
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                                    value={specialistFilter}
                                    onChange={(e) => setSpecialistFilter(e.target.value)}
                                >
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
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 lg:w-auto"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
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

                        <div className="h-[calc(100vh-200px)] overflow-y-auto">
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
                                                className="justify-center px-2 py-1 mt-3 font-semibold text-white capitalize bg-[#8697C4] tracking-[2px] max-md:px-5 hover:bg-[#ADBBDA]"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="flex mt-4">
                                {[...Array(Math.ceil(filteredDoctors.length / doctorsPerPage)).keys()].map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number + 1)}
                                        className={`px-4 py-2 ${currentPage === number + 1 ? "bg-indigo-400 text-white" : "bg-white border text-neutral-800"} rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mx-1`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}
                            </div> */}
                            {renderPagination()}
                            <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-end">
                                {`Showing ${currentDoctors.length} out of ${filteredDoctors.length} matches`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDoctors;
