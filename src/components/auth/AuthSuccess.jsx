// src/components/auth/AuthSuccess.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const AuthSuccess = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AuthSuccess;
