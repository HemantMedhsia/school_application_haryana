import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css";

const AnimatedErrorPage = () => {
  const navigate = useNavigate();
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const reloadPage = () => {
    window.location.reload();
    navigate(-1); 
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-br from-yellow-100 to-red-200 text-gray-800">
      <div className="w-1/2 mb-8">
        <div className="relative h-40 w-40">
          <div className="absolute inset-0 bg-red-300 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔥</span>
          </div>
        </div>
      </div>
      <h1 className="text-5xl font-extrabold mb-4">Oh Snap! Something Broke</h1>
      <p className="text-lg mb-6 text-center px-4">
        Our code monkeys are on it{'.'.repeat(dotCount)}<br />
        In the meantime, you can try reloading the page!
      </p>
      <div className="flex space-x-4">
        <button
          onClick={reloadPage}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Reload Page
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default AnimatedErrorPage;

