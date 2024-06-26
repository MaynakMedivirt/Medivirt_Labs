import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CompanySide from "./CompanySide";
import CompanyNavbar from "./CompanyNavbar";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FaEdit } from "react-icons/fa";
import { MdAutoDelete } from "react-icons/md";
import "../style/Company.css";

const Users = () => {
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
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("companyId", "==", id));
      const querySnapshot = await getDocs(q);

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    fetchUsers();
  }, [id]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.role &&
        user.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.location &&
        user.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleEditProfile = (userId, companyId) => {
    navigate(`/company/edit-user/${companyId}`, { state: { userId } });
  };

  return (
    <div className="flex flex-col h-screen">
      <CompanyNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`overflow-y-auto flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-60" : "ml-20"
          }`}
        >
          <div className="container px-4 mx-auto my-10">
            <div id="users" className="flex justify-between items-center">
              <h2 className="text-[1.5rem] font-bold text-center uppercase">
                <span className="bg-[#8697C4] text-white p-2">Users</span>
              </h2>
              <div id="userslink">
                <Link
                  to={`/company/add-user/${id}`}
                  className="bg-[#8697C4] hover:bg-[#ADBBDA] text-white font-bold py-2 px-4 rounded"
                >
                  Add Users
                </Link>
              </div>
            </div>

            <div className="flex justify-end items-center py-2.5 pr-2.5 pl-5 bg-white rounded max-md:flex-wrap max-md:max-w-full">
              <div className="flex items-center">
                <div className="flex flex-col justify-end sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by User name and role"
                    className="px-4 py-2 border border-gray-300 w-full sm:w-1/3 lg:w-auto"
                  />
                </div>
                <button
                  onClick={() => console.log("Search logic here")}
                  className="p-2 bg-[#ADBBDA] text-white hover:bg-[#8697C4] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="overflow-auto shadow-md sm:rounded-lg mt-3 table-container">
              <table className="divide-y border divide-gray-300 w-full text-left rtl:text-right">
                <thead className="text-sm text-gray-700 uppercase ">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 tracking-wider bg-gray-50"
                    >
                      S.N.
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 tracking-wider">
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 tracking-wider bg-gray-50"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b dark:border-gray-200"
                    >
                      <td
                        scope="row"
                        className="px-2 py-3 bg-gray-50 text-center font-medium"
                      >
                        {indexOfFirstUser + index + 1}.
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 bg-gray-50">{user.role}</td>
                      <td className="px-4 py-3">{user.location}</td>
                      <td className="px-4 py-3 bg-gray-50">
                        <button
                          onClick={() =>
                            handleEditProfile(user.id, user.companyId)
                          }
                          type="button"
                          className="text-white bg-[#8697C4] rounded-lg px-3 py-2 text-center me-2 mb-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="text-white bg-[#8697C4] rounded-lg px-3 py-2 text-center me-2 mb-2"
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
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  className={`px-3 py-2 mx-1 rounded-md font-bold ${
                    currentPage === number
                      ? "bg-transparent text-gray-800 border border-[#7191E6] hover:bg-[#7191E6] hover:text-white"
                      : "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-300"
                  }`}
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

export default Users;
