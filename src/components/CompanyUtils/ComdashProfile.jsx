import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import Image from "../../assets/img/defaultAvatar.png";
import Banner from "../../assets/img/Banner.png";
import { FaPen } from "react-icons/fa";
import CompanyNavbar from "./CompanyNavbar";
import CompanySide from "./CompanySide";

const ComdashProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const db = getFirestore();
        const docRef = doc(db, "companies", id);
        const companySnapshot = await getDoc(docRef);
        if (companySnapshot.exists()) {
          setCompany({ id: companySnapshot.id, ...companySnapshot.data() });
        } else {
          console.log("No such company");
        }
      } catch (error) {
        console.log("Error fetching company :", error);
      }
    };

    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, where("companyId", "==", id));
      const querySnapshot = await getDocs(q);

      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
    };

    fetchCompany();
    fetchProducts();
  }, [id]);

  const saveProfile = async () => {
    try {
      const db = getFirestore();
      const companyRef = doc(db, "companies", id);
      await updateDoc(companyRef, company);
      console.log("Company profile updated successfully!");
      alert("profile updated successfully!");
      navigate(`/companyDashboard/${id}`);
    } catch (error) {
      console.error("Error updating company profile:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const EditAbout = () => {
    navigate(`/company/profile/edit-about/${id}`);
  };

  const EditCompanyName = () => {
    navigate(`/company/profile/edit-Name/${id}`);
  };

  const EditCompanyDetails = () => {
    navigate(`/company/profile/edit-details/${id}`);
  };

  // Add more edit navigation functions as needed

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
          {company && (
            <div className="container px-4 mx-auto my-10">
              <div className="overflow-hidden">
                <div
                  id="comprofile"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
                >
                  <div className="col-span-1 md:col-span-2 mt-5">
                    <div
                      className="overflow-hidden"
                      style={{
                        backgroundImage: `url(${Banner})`,
                        // height: "250px",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="flex items-center">
                        <div className="p-6">
                          <div className="mb-4">
                            {company.image ? (
                              <img
                                src={company.image}
                                alt={`Profile of ${company.name}`}
                                className=""
                                style={{ width: "50%" }}
                              />
                            ) : (
                              <img
                                src={Image}
                                alt="Placeholder"
                                className=""
                                style={{ width: "20%" }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex space-x-4">
                              <h1 className="text-xl text-gray-800 font-bold">
                                {company.companyName}
                              </h1>
                              <FaPen
                                className="text-[#8697C4] cursor-pointer text-center m-auto"
                                onClick={EditCompanyName}
                              />
                            </div>
                            <p className="text-lg text-gray-600">
                              {company.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="bg-white border rounded-lg overflow-hidden shadow-lg">
                      <div className="">
                        <div className="mt-5">
                          <div
                            id="companydetails"
                            className="p-6 md:p-2 md:h-auto"
                          >
                            <div className="flex items-center justify-between mb-5">
                              <p className="text-sm ">Categories:</p>
                              <p className="text-sm font-semibold">
                                {company.category}
                              </p>
                            </div>
                            <hr className="mb-3 border-gray-300"></hr>
                            <div className="flex items-center justify-between mb-5">
                              <span className="text-sm">Email:</span>
                              <span className="text-sm font-semibold">
                                {company.email}
                              </span>
                            </div>
                            <hr className="mb-3 border-gray-300"></hr>
                            <div className="flex items-center justify-between mb-5">
                              <p className="text-sm">Phone: </p>
                              <p className="text-sm font-semibold capitalize">
                                {company.phone}
                              </p>
                            </div>
                            <hr className="mb-3 border-gray-300"></hr>
                            <div className="flex items-center justify-between mb-5">
                              <p className="text-sm">Location: </p>
                              <p className="text-sm font-semibold capitalize">
                                {company.headquarter}
                              </p>
                            </div>
                            <hr className="mb-3 border-gray-300"></hr>
                            <FaPen
                              className="text-[#8697C4] cursor-pointer ml-auto"
                              onClick={EditCompanyDetails}
                            />
                            {/* <hr className="mb-3 border-gray-300"></hr> */}
                            <div className="flex items-center justify-center">
                              <button className="flex gap-1.5 justify-center items-center px-6 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5">
                                Contact
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="flex" id="combutton">
                    <div className="relative">
                      <h1
                        className={`text-xl px-1 font-semibold cursor-pointer ${
                          activeTab === "about"
                            ? "bg-[#8697C4] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveTab("about")}
                      >
                        About Company
                      </h1>
                      <div className="absolute right-[-10px] top-0 h-full border-r-2 border-gray"></div>
                    </div>

                    <div className="relative ml-5">
                      <h1
                        className={`text-xl px-1 font-semibold cursor-pointer ${
                          activeTab === "product"
                            ? "bg-[#8697C4] text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setActiveTab("product")}
                      >
                        Product
                      </h1>
                    </div>
                  </div>

                  <div className="mt-5">
                    {activeTab === "about" && (
                      <div className="flex flex-col md:flex-row justify-between px-4 bg-white shadow-lg border p-3">
                        <p className="p-4 mb-5">{company.about}</p>
                        <p className="text-end p-4" onClick={EditAbout}>
                          <FaPen
                            className="text-[#8697C4]"
                            style={{ float: "inline-end" }}
                          />
                        </p>
                      </div>
                    )}
                    {activeTab === "product" && (
                      <div className="overflow-auto mt-3">
                        <table className="min-w-full divide-y border divide-gray-200">
                          <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-sm tracking-wider"
                              >
                                S.N.
                              </th>
                              <th
                                scope="col"
                                className="bg-gray-50 px-6 py-3 text-sm uppercase tracking-wider"
                              >
                                Product Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-sm uppercase tracking-wider"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product, index) => (
                              <tr
                                key={product.id}
                                className="border-b border-gray-200"
                              >
                                <td scope="row" className="px-4 py-2">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50">
                                  {product.productName}
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    type="button"
                                    className="text-white bg-[#7191E6] rounded-lg px-3 py-2 text-center me-2 mb-2"
                                  >
                                    About Product
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center mb-[3rem]">
                  <button
                    onClick={saveProfile}
                    className="flex gap-1.5 justify-center items-center px-10 py-2 mt-5 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-5"
                  >
                    save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComdashProfile;
