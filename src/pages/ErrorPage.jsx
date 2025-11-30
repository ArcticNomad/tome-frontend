// src/pages/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = ({ statusCode = '404', message = 'Page Not Found' }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-yellow-500" size={60} />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-2">{statusCode}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{message}</h2>
        <p className="text-gray-500 mb-6">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
