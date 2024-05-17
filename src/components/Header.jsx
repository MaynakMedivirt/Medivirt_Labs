import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineUser } from 'react-icons/ai';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useAuth } from './AuthContext';
import MedivirtLogo from '../assets/img/Medivirt.png'

const Header = () => {
  const location = useLocation();
  // const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useAuth();


  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, user => {
  //     setCurrentUser(user);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // console.log(currentUser)

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully.');
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  const renderIndicator = path => {
    const isActive = location.pathname === path;
    return isActive ? <div className="absolute bottom-0 top-9 left-1/2 transform -translate-x-1/2 h-[10px] w-16 bg-white rounded-t-lg" /> : null;
  };


  // const renderUserDetails = () => {
  //   if (currentUser) {
  //     if (currentUser.name) {
  //       const { name, role, id } = currentUser;
  //       return (
  //         <div className="mr-2">
  //           <Link to={role === 'Doctor' ? `/doctorDashboard/${id}` : `/profilecomplete/${id}`} className='text-sm font-bold'>{name}</Link>
  //           <p className='text-sm'>{role}</p>
  //         </div>
  //       );
  //     } else if (currentUser.email) {
  //       return currentUser.email;
  //     }
  //   }
  //   // return 'User Profile';
  // };

  const renderUserDetails = () => {
    if (currentUser) {
      if (currentUser.role === 'Company') {
        if (currentUser.profileComplete) {
          return (
            <div className="mr-2">
              <Link to={`/companydashboard/${currentUser.id}`} className='text-sm font-bold'>
                {currentUser.name}
              </Link>
              <p className='text-sm'>{currentUser.companyName}</p>
            </div>
          );
        } else {
          return (
            <div className="mr-2">
              <Link to={`/profilecomplete/${currentUser.id}`} className='text-sm font-bold'>
                {currentUser.name}
              </Link>
            </div>
          );
        }
      } else if (currentUser.role === 'Doctor') {
        return (
          <div className="mr-2">
            <Link to={`/doctorDashboard/${currentUser.id}`} className='text-sm font-bold'>
              {currentUser.name}
            </Link>
            <p className='text-sm'>{currentUser.role}</p>
          </div>
        );
      }
    }
    return null;
  };



  return (
    <div className="relative w-full h-16 bg-[#3D52A1] flex justify-between items-center px-6 md:px-10 lg:px-18">
      <NavLink to="/" className="flex-shrink-0">
        <img className="h-8" alt="Medivirt" src={MedivirtLogo} />
      </NavLink>

      <div className="hidden md:flex justify-center space-x-6 flex-1">
        <NavLink to="/" className="font-semibold text-white relative" onClick={closeMenu}>
          HOME
          {renderIndicator('/')}
        </NavLink>
        <NavLink to="/doctorlist" className="font-semibold text-white relative" onClick={closeMenu}>
          DOCTORS
          {renderIndicator('/doctorlist')}
        </NavLink>
        <NavLink to="/companylist" className="font-semibold text-white relative" onClick={closeMenu}>
          COMPANIES
          {renderIndicator('/companylist')}
        </NavLink>
        <NavLink to="/price" className="font-semibold text-white relative" onClick={closeMenu}>
          PRICING
          {renderIndicator('/price')}
        </NavLink>
        <NavLink to="/signup" className="font-semibold text-white relative" onClick={closeMenu}>
          JOIN NOW
          {renderIndicator('/signup')}
        </NavLink>
      </div>

      <div className="flex items-center space-x-4">
        {/* Show user icon only on medium and larger screens */}
        <div className="hidden md:block relative">
          {currentUser ? (
            <>
              <div className="flex items-center">
                <p className="text-white px-2 cursor-pointer">{renderUserDetails()}</p>
                <AiOutlineUser className="w-6 h-6 text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
              </div>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow z-10">
                  <button className="block w-full text-left p-2 hover:bg-gray-200" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </>
          ) : (
            <>
              <AiOutlineUser className="w-6 h-6 text-white cursor-pointer" onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow z-10">
                  <NavLink to="/login" className="block w-full text-left p-2 hover:bg-gray-200" onClick={closeMenu}>Login</NavLink>
                  <NavLink to="/signup" className="block w-full text-left p-2 hover:bg-gray-200" onClick={closeMenu}>Sign Up</NavLink>
                </div>
              )}
            </>
          )}
        </div>

        {/* Show user icon on small screens */}
        <AiOutlineMenu className="w-6 h-6 text-white cursor-pointer block md:hidden" onClick={() => setMenuOpen(!menuOpen)} />
      </div>

      {/* Responsive Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#3D52A1] z-20 md:hidden">
          <div className="flex flex-col items-center py-4 space-y-4">
            <NavLink to="/" className="text-white" onClick={closeMenu}>HOME</NavLink>
            <NavLink to="/doctorlist" className="text-white" onClick={closeMenu}>DOCTORS</NavLink>
            <NavLink to="/companylist" className="text-white" onClick={closeMenu}>COMPANIES</NavLink>
            <NavLink to="/price" className="text-white" onClick={closeMenu}>PRICING</NavLink>
            <NavLink to="/signup" className="text-white" onClick={closeMenu}>JOIN NOW</NavLink>
            {currentUser ? (
              <button className="text-white" onClick={handleLogout}>Logout</button>
            ) : (
              <NavLink to="/login" className="text-white" onClick={closeMenu}>Login</NavLink>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;