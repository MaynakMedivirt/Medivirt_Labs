// WarningPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const WarningPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Warning: Unauthorized Access</h1>
      <p className="text-lg text-gray-800 mb-6">You are not authorized to view this page.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go to Home Page</Link>
    </div>
  );
};

export default WarningPage;