import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate(); // ✅ Hook for navigation

  return (
    <div
      className="relative h-[600px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/SRM_University_board_and_Entry_of_SRM_University_Amaravati.jpg")',
      }}
    >
      {/* ✅ Overlay with pointer-events enabled */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-auto">
        <div className="relative text-center max-w-4xl px-4">
          <div className="relative rounded-2xl p-8 z-10">
            {/* ✅ SRM AP Logo */}
            <img
              src="https://srmap.edu.in/file/2018/03/SRMAP-Logo.png"
              alt="SRM AP Logo"
              className="h-24 mx-auto mb-8 backdrop-blur-sm bg-white/30 p-2 rounded-lg"
            />


            {/* ✅ Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Together We Build
              <span className="block text-yellow-400 mt-2">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
              Connect with SRM AP's Global Alumni Network
            </p>

            {/* ✅ Buttons with z-index and pointer-events fix */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => navigate('/student/network')}
                className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-xl font-medium hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50 z-50 relative pointer-events-auto"
              >
                Join Network
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Bottom Gradient (Ensure it doesn’t block clicks) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
    </div>
  );
}
