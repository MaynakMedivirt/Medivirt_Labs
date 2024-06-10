import React from "react";

const CompanyFM = ({
  allIndustries,
  allLocations,
  selectedIndustries,
  setSelectedIndustries,
  selectedLocations,
  setSelectedLocations,
  drawerOpen,
  setDrawerOpen,
}) => {
  return (
    <div className={`lg:w-1/4 p-4 ${drawerOpen ? "block" : ""} md:block`}>
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Filter By Industry</h2>
        <div className="flex flex-col gap-2.5">
          {/* Dropdown for small screens */}
          <select
            value={selectedIndustries}
            onChange={(e) => setSelectedIndustries(e.target.value)}
            className={`w-full py-2 px-3 border border-gray-300 rounded-md mb-4 md:hidden`}
          >
            <option value="">All</option>
            {allIndustries.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
          {/* Checkboxes for larger screens */}
          <div
            className={`flex items-center gap-2.5 md:block ${
              drawerOpen ? "block" : "hidden"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIndustries.length === 0}
              onChange={() => setSelectedIndustries([])}
              className="cursor-pointer mr-[10px]"
            />
            <span
              onClick={() => setSelectedIndustries([])}
              className="cursor-pointer"
            >
              All
            </span>
          </div>
          {/* Company checkboxes for larger screens */}
          {allIndustries.map((company, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 md:block ${
                drawerOpen ? "block" : "hidden"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIndustries.includes(company)}
                onChange={() =>
                  setSelectedIndustries((prev) =>
                    prev.includes(company)
                      ? prev.filter((item) => item !== company)
                      : [...prev, company]
                  )
                }
                className="cursor-pointer mr-[10px]"
              />
              <span
                onClick={() =>
                  setSelectedIndustries((prev) =>
                    prev.includes(company)
                      ? prev.filter((item) => item !== company)
                      : [...prev, company]
                  )
                }
                className="cursor-pointer"
              >
                {company}
              </span>
            </div>
          ))}
        </div>
        
        <hr className="my-4" id="filterline" />

        <h2 className="text-lg font-semibold mb-2 mt-4">Filter By Location</h2>
        <div className="flex flex-col gap-2.5">
          {/* Dropdown for small screens */}
          <select
            value={selectedLocations}
            onChange={(e) => setSelectedLocations([e.target.value])}
            className={`w-full py-2 px-3 border border-gray-300 rounded-md ${
              drawerOpen ? "block" : ""
            } md:hidden`}
          >
            <option value="">All</option>
            {allLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
          {/* Checkboxes for larger screens */}
          <div
            className={`flex items-center gap-2.5 md:block ${
              drawerOpen ? "block" : "hidden"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedLocations.length === 0}
              onChange={() => setSelectedLocations([])}
              className="cursor-pointer mr-[10px]"
            />
            <span
              onClick={() => setSelectedLocations([])}
              className="cursor-pointer"
            >
              All
            </span>
          </div>
          {/* Location checkboxes for larger screens */}
          {allLocations.map((location, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 md:block ${
                drawerOpen ? "block" : "hidden"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedLocations.includes(location)}
                onChange={() =>
                  setSelectedLocations((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  )
                }
                className="cursor-pointer mr-[10px]"
              />
              <span
                onClick={() =>
                  setSelectedLocations((prev) =>
                    prev.includes(location)
                      ? prev.filter((item) => item !== location)
                      : [...prev, location]
                  )
                }
                className="cursor-pointer"
              >
                {location}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyFM;
