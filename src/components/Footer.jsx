import React from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import MedivirtLogo from "../assets/img/Medivirt.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed successfully!");
  };

  return (
    <footer className="bg-[#3D52A1] py-8 text-sm text-[#818990] font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center lg:justify-between">
          {/* Left section */}
          <div className="w-full lg:w-1/3 px-4 flex justify-center mb-8 lg:mb-0 lg:justify-start">
            <div className="w-full lg:max-w-lg">
              <div className="flex flex-wrap items-top mb-6 justify-center">
                <div className="w-full lg:w-[170px] px-4">
                  <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2 text-white">
                    Useful Links
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <NavLink
                        to="/"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                      >
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/doctorlist"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="/doctorlist"
                      >
                        Doctor
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="/"
                      >
                        Company
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/price"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="/price"
                      >
                        Pricing
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-[170px] px-4">
                  <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2 text-white">
                    Other Resources
                  </span>
                  <ul className="list-unstyled">
                    <li>
                      <NavLink
                        to="/signup"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="/signup"
                      >
                        Join Us
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href=""
                      >
                        Terms &amp; Conditions
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="#"
                      >
                        Privacy Policy
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/learnMore"
                        className="text-white hover:text-[#FFF] font-semibold block pb-2 text-sm"
                        href="/learnMore"
                      >
                        How It Works ?
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Middle section (centered both horizontally and vertically) */}
          <div className="w-full lg:w-1/3 flex flex-col justify-center items-center px-3 lg:text-center mb-8">
            <img
              alt="Medivirt"
              className="max-w-full w-[170px] mx-auto"
              src={MedivirtLogo}
            />
            <div className="mt-5 text-white">
              Follow us on Medivirt for more updates !
            </div>
            <div className="mt-6 mb-8 relative">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col md:flex-row items-center md:items-start"
              >
                <div className="relative flex-grow w-full">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white border border-gray-300 py-3 px-4 pr-40 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white hover:bg-indigo-500 absolute top-0 right-0 h-full py-3 px-4 transition-all duration-300 ease-in-out"
                      style={{ height: "100%" }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-center lg:justify-start space-x-4 mb-6 text-white">
              <a href="/">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="/">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/medivirt-labs/?originalSubdomain=in">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right section */}
          <div className="w-full lg:w-1/3 px-4 lg:px-10 mt-5 lg:mt-0 text-center lg:text-right">
            <div className="text-lg font-bold text-white mb-4">Contact Us</div>
            <div
              className="text-sm font-medium text-white mt-6"
              style={{ lineHeight: "2.5" }}
            >
              Better yet, Meet us Virtually!
              <br />
              MEDIVIRT LABS 
              <br />
              Bangalore, Karnataka, India
              <br />
              <a href="mailto:meet@medivirt.com" className="">
                meet@medivirt.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <hr className="my-6 border-blueGray-300" />
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-center">
          <div className="text-sm text-white font-semibold py-1 text-center">
            COPYRIGHT ©{" "}
            <span id="get-current-year">
              {new Date().getFullYear()} MEDIVIRT LABS - ALL RIGHTS RESERVED.
            </span>
            <p className="mt-5">POWERED BY MEDIVIRT</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
