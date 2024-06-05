import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SalesNavbar from "./SalesNavbar";
import SalesSide from "./SalesSide";
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";

const SalesHeadUsers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const { id } = useParams();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore();
            const salesHeadDoc = doc(db, "users", id);
            const salesHeadSnap = await getDoc(salesHeadDoc);

            if (salesHeadSnap.exists()) {
                const companyId = salesHeadSnap.data().companyId;
                console.log(companyId);

                const usersCollection = collection(db, "users");
                const q = query(
                    usersCollection,
                    where("companyId", "==", companyId),
                    where("role", "==", "Medical Representative")
                );
                const querySnapshot = await getDocs(q);

                const usersList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
                console.log(usersList);
            };
        }

        fetchUsers();
    }, [id]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredUsers = users.filter(user =>
        (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleEditProfile = (userId) => {
        navigate(`/sales/edit-user/${id}`, { state: { userId } });
    };

    return (
        <div className="flex flex-col h-screen">
            <SalesNavbar />
            <div className="flex flex-1 mt-[4.2rem]">
                <SalesSide open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
                    <div className="container max-w-6xl px-5 mx-auto my-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[1.5rem] font-bold text-center uppercase">Users</h2>
                            <Link
                                to={`/sales/add-user/${id}`}
                                className="bg-[#7191E6] hover:bg-[#3a60c6] text-white font-bold py-2 px-4 rounded"
                            >
                                Add Users
                            </Link>
                        </div>
                        <div className="flex justify-end items-center py-2.5 pr-2.5 pl-5 bg-white rounded max-md:flex-wrap max-md:max-w-full">
                            <div className="flex items-center">
                                <div className="flex flex-col mx-2 justify-center self-stretch my-auto border rounded-md">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search by user name and role"
                                        className="p-2"
                                    />
                                </div>
                                <button
                                    onClick={() => console.log('Search logic here')}
                                    className="p-2 rounded bg-[#3D52A1] text-white  hover:bg-[#7191E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="overflow-auto mt-3 border">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-sm tracking-wider">
                                            S.N.
                                        </th>
                                        <th scope="col" className="bg-gray-50 px-4 py-3 text-sm uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-sm uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th scope="col" className="bg-gray-50 px-4 py-3 text-sm uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-sm uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentUsers.map((user, index) => (
                                        <tr key={user.id} className="border-b border-gray-200">
                                            <td scope="row" className="px-4 py-2">
                                                {indexOfFirstUser + index + 1}
                                            </td>
                                            <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50">
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td className="px-4 py-2 font-medium text-gray-900 ">
                                                {user.role}
                                            </td>
                                            <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50">
                                                {user.location}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleEditProfile(user.id, user.companyId)}
                                                    type="button"
                                                    className="text-white bg-[#7191E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-white bg-[#7191E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                                >
                                                    <MdAutoDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end my-2">
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    className={`px-3 py-2 mx-1 rounded-md font-bold ${currentPage === number ? 'bg-transparent text-gray-800 border border-[#7191E6] hover:bg-[#7191E6] hover:text-white' : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300'}`}
                                    onClick={() => paginate(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SalesHeadUsers;
