import React from 'react';
import { Hospital } from 'lucide-react';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Hospital className="w-24 h-24 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          HealthCare Plus Hospital
        </h1>
        <p className="text-xl text-gray-600 mb-8">Advanced Patient Management System</p>
        <button
          onClick={onNavigateToLogin}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;
