import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";
import { IoMdArrowBack } from "react-icons/io";

const EditCompanyAbout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [company, setCompany] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "companies", id);
        const CompanySnapshot = await getDoc(docRef);
        if (CompanySnapshot.exists()) {
          setCompany({ id: CompanySnapshot.id, ...CompanySnapshot.data() });
        } else {
          console.log("No such Company");
        }
      } catch (error) {
        console.log("Error fetching Company :", error);
      }
    };
    fetchCompany();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const CompanyRef = doc(db, "companies", id);
      const newData = {
        ...company,
      };

      await updateDoc(CompanyRef, newData);

      console.log("Document successfully updated!");
      alert("Data successfully updated!");
      // setCompany(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate(`/company/profile/${id}`);

      // fetchCompany();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <div className="flex flex-col h-screen">
      <CompanyNavbar />
      <div className="flex flex-1 mt-[4.2rem]">
        <CompanySide open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`overflow-y-auto flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>

          <div className="container max-w-6xl px-5 mx-auto my-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 bg-white shadow border rounded-full flex items-center justify-center"
                >
                  <IoMdArrowBack className="h-6 w-6 font-bold text-[#3D52A1]" />
                </button>
                <h2 className="flex-grow text-2xl my-5 font-bold text-center uppercase">Edit About Company</h2>
              </div>

              <div class="mb-5">
                <label htmlFor="about" class="block mb-2 px-2 text-lg font-bold text-gray-900 dark:text-white">About :</label>
                <textarea
                  name="about"
                  id="about"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={company ? company.about : ''}
                  onChange={(e) => setCompany({ ...company, about: e.target.value })}
                  placeholder=" "
                ></textarea>
              </div>
              <div className="flex justify-end items-center">
                <button type="submit" class="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5">Update</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditCompanyAbout;
