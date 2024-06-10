import React from "react";

const FilterMenu = ({
  allSpecialists,
  allLocations,
  selectedSpecialists,
  setSelectedSpecialists,
  selectedLocations,
  setSelectedLocations,
  searchQuery,
  setSearchQuery,
  drawerOpen,
  setDrawerOpen,
}) => {
  return (
    <div className={`lg:w-1/4 p-4 ${drawerOpen ? "block" : ""} md:block`}>
      <div className="bg-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Filter By Specialist</h2>
        <div className="flex flex-col gap-2.5">
          {/* Dropdown for small screens */}
          <select
            value={selectedSpecialists}
            onChange={(e) => setSelectedSpecialists(e.target.value)}
            className={`w-full py-2 px-3 border border-gray-300 rounded-md mb-4 md:hidden`}
          >
            <option value="">All</option>
            {allSpecialists.map((specialist, index) => (
              <option key={index} value={specialist}>
                {specialist}
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
              checked={selectedSpecialists.length === 0}
              onChange={() => setSelectedSpecialists([])}
              className="cursor-pointer mr-[10px]"
            />
            <span
              onClick={() => setSelectedSpecialists([])}
              className="cursor-pointer"
            >
              All
            </span>
          </div>
          {/* Specialist checkboxes for larger screens */}
          {allSpecialists.map((specialist, index) => (
            <div
              key={index}
              className={`flex items-center gap-2.5 md:block ${
                drawerOpen ? "block" : "hidden"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedSpecialists.includes(specialist)}
                onChange={() =>
                  setSelectedSpecialists((prev) =>
                    prev.includes(specialist)
                      ? prev.filter((item) => item !== specialist)
                      : [...prev, specialist]
                  )
                }
                className="cursor-pointer mr-[10px]"
              />
              <span
                onClick={() =>
                  setSelectedSpecialists((prev) =>
                    prev.includes(specialist)
                      ? prev.filter((item) => item !== specialist)
                      : [...prev, specialist]
                  )
                }
                className="cursor-pointer"
              >
                {specialist}
              </span>
            </div>
          ))}
        </div>
        <hr className="my-4" id="filterline"/>
        <h2 className="text-lg font-semibold mb-2">Filter By Location</h2>
        <div className="flex flex-col gap-2.5">
          {/* Dropdown for small screens */}
          <select
            value={selectedLocations}
            onChange={(e) => setSelectedLocations(e.target.value)}
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
              className="cursor-pointer mr-[10p"
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

export default FilterMenu;
