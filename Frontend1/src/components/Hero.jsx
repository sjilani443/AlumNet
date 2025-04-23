import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase, Calendar } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'student';

  const handleJoinNetwork = () => {
    if (role === 'student') {
      navigate('/student/network');
    } else {
      navigate('/alumni/network');
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const stats = [
    { icon: Users, value: "500+", label: "Active Alumni" },
    { icon: Briefcase, value: "100+", label: "Job Postings" },
    { icon: Calendar, value: "50+", label: "Events" },
  ];

  return (
    <div
      className="relative h-[700px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          'url("https://upload.wikimedia.org/wikipedia/commons/8/80/SRM_University_board_and_Entry_of_SRM_University_Amaravati.jpg")',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={1}>
                <img
                  src="https://srmap.edu.in/file/2018/03/SRMAP-Logo.png"
                  alt="SRM AP Logo"
                  className="h-20 w-auto mb-6"
                />
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                  Together We Build
                  <span className="block text-yellow-400 mt-2">Excellence</span>
                </h1>
                <p className="text-xl text-gray-200 mt-6 max-w-lg">
                  Connect with SRM AP's Global Alumni Network. Share opportunities, 
                  grow together, and build lasting professional relationships.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const role = localStorage.getItem('role') || 'student';
                    if (role === 'student') {
                      navigate('/student/network');
                    } else {
                      navigate('/alumni/network');
                    }
                  }}
                  className="group flex items-center gap-2 px-8 py-4 bg-yellow-500 text-gray-900 rounded-xl font-medium hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
                >
                  Join Network
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column - Stats */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={3}
              className="grid grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  custom={index + 4}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
