import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CompanySide from "./CompanySide";
import CompanyNavbar from "./CompanyNavbar";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import "../style/Company.css";

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const { id } = useParams();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, where("companyId", "==", id));
      const querySnapshot = await getDocs(q);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      });

      return () => unsubscribe();
    };

    fetchProducts();
  }, [id]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredProducts.length / productsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

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
            
            <div id="product"className="flex justify-between items-center">
              <h2 className="text-[1.5rem] font-bold text-center uppercase">
                <span className="bg-[#8697C4] text-white p-2">Products</span>
              </h2>
              <div id="productlink">
              <Link
                to={`/company/add-product/${id}`}
                className="bg-[#8697C4] hover:bg-[#ADBBDA] text-white font-bold py-2 px-4 rounded"
              >
                Add Product
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
                    placeholder="Search by product name"
                    className="px-4 py-2 border border-gray-300 w-full lg:w-auto"
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

            <div className="overflow-auto mt-3 border tzble-container">
              <table id="tables" className="min-w-full divide-y divide-gray-200">
                <thead className="text-xs text-gray-700 font-bold border-t border-gray-200 text-left uppercase">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-sm tracking-wider bg-[#ADBBDA] text-white"
                    >
                      S.N.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-sm uppercase tracking-wider bg-[#8697C4] text-white"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-sm uppercase tracking-wider bg-[#ADBBDA] text-white"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product, index) => (
                    <tr key={product.id} className="border-b border-gray-200">
                      <td scope="row" className="px-4 py-2">
                        {indexOfFirstProduct + index + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900 bg-gray-50">
                        {product.productName}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          className="text-white bg-[#8697C4] rounded-lg px-3 py-2 text-center me-2 mb-2"
                        >
                          About Product
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

export default Products;
