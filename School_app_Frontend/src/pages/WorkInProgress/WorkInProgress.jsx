import React from 'react';
import { FaTools } from 'react-icons/fa';

const WorkInProgress = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh]
                 bg-gradient-to-br from-gray-900 text-white overflow-hidden"
    >
      {/* Icon with Wiggle Animation */}
      <div className="relative">
        <FaTools className="text-9xl text-rose-500 animate-wiggle" />

        {/* Pulsing Circle Behind Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-green-400 rounded-full opacity-50 animate-ping"></div>
        </div>
      </div>

      {/* Heading with Pulse Animation */}
      <h1 className="text-5xl font-bold mt-8 animate-pulse text-[#7376f0]">Page Under Construction</h1>

      {/* Subtext */}
      <p className="text-2xl mt-4 max-w-lg text-center">
        We're currently working hard to build something amazing! Please check back soon.
      </p>
    </div>
  );
};

export default WorkInProgress;
