// src/components/auth/AuthFailure.jsx
import React from 'react';
import { XCircle } from 'lucide-react';

const AuthFailure = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="text-red-600" size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default AuthFailure;
