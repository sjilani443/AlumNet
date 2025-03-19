import React from 'react';

export default function Hero() {
  return (
    <div className="relative h-[600px] bg-cover bg-center overflow-hidden" style={{
      backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/8/80/SRM_University_board_and_Entry_of_SRM_University_Amaravati.jpg")'
    }}>
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="relative text-center max-w-4xl px-4">
          <div className="relative rounded-2xl p-8">
            <img 
              src="https://srmap.edu.in/file/2018/03/SRMAP-Logo.png" 
              alt="SRM AP Logo" 
              className="h-24 mx-auto mb-8"
            />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Together We Build 
              <span className="block text-accent-yellow mt-2">Excellence</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
              Connect with SRM AP's Global Alumni Network
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto px-8 py-4 bg-accent-yellow text-primary-500 rounded-xl font-medium hover:bg-accent-yellow/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-yellow/25">
                Join Network
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/30">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}