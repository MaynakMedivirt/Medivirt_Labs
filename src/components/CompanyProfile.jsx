import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Header from "./Header";
import Footer from "./Footer";
import defaultAvatar from "../assets/img/defaultAvatar.png";
import Banner from "../assets/img/Banner.png";

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const db = getFirestore();
        const companyDoc = doc(db, "companies", id);
        const companySnapshot = await getDoc(companyDoc);
        if (companySnapshot.exists()) {
          setCompany({ id: companySnapshot.id, ...companySnapshot.data() });
        } else {
          setError("Company not found");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        setError("Error fetching company: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsCollection = collection(db, "products");
        const q = query(productsCollection, where("companyId", "==", id));
        const productsSnapshot = await getDocs(q);
        const fetchedProducts = [];
        productsSnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (id) {
      fetchCompany();
      fetchProducts();
    } else {
      setError("Invalid company ID");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div className={`overflow-y-auto flex-1 transition-all duration-300`}>
        <div className="container max-w-6xl px-5 mx-auto my-10">
          <div className="overflow-hidden mt-[20px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10">
              <div className="col-span-1 md:col-span-2 mt-5">
                <div
                  className="overflow-hidden"
                  style={{
                    backgroundImage: `url(${Banner})`,
                    height: "250px",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex items-center">
                    <div className="p-8">
                      <div className="mb-4">
                        <img
                          src={company.image || defaultAvatar}
                          alt={`Profile of ${company.name}`}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex space-x-4">
                          <h1 className="text-xl text-gray-800 font-bold">
                            {company.name}
                          </h1>
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
                <div className="bg-white border overflow-hidden mt-5 shadow-lg">
                  <div className="mt-5">
                    <div className="p-6 md:p-5 md:h-auto">
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
            <div className="mt-10">
              <div className="flex">
                <h1
                  className={`text-xl px-1 font-semibold cursor-pointer ${activeTab === "about"
                      ? "bg-[#EEE7F6] text-black"
                      : "text-gray-800"
                    }`}
                  onClick={() => setActiveTab("about")}
                >
                  About Company
                </h1>
                <h1
                  className={`text-xl px-1 ml-5 font-semibold cursor-pointer ${activeTab === "products"
                      ? "bg-[#EEE7F6] text-black"
                      : "text-gray-800"
                    }`}
                  onClick={() => setActiveTab("products")}
                >
                  Product
                </h1>
              </div>
              <div className="mt-5">
                {activeTab === "about" && (
                  <div className="flex flex-col md:flex-row justify-between px-4 bg-white shadow-lg border p-3">
                    <p className="p-4 mb-5">{company.about}</p>
                  </div>
                )}
                {activeTab === "products" && (
                  <div className="mt-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-3">
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow p-4">
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="w-full h-32 object-contain mb-4 rounded"
                            />
                            <h2 className="text-lg font-semibold mb-2">{product.productName}</h2>
                            <p className="text-gray-600">{product.productDetails}</p>
                            <div className="text-center">
                              <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                About Product
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No products available.</p>
                      )}
                      {/* Add empty grid items to fill remaining spaces for a 5x5 grid */}
                      {Array.from({ length: Math.max(0, 5 - (products.length % 5)) }).map((_, index) => (
                        <div key={index} className="bg-transparent"></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CompanyProfile;
