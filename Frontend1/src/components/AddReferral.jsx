import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Briefcase, Building2, MapPin, FileText, Link as LinkIcon, ListChecks, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function AddReferral() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    requirements: "",
    location: "",
    type: "Full-time",
    referralLink: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(",").map((req) => req.trim())
      };

      const response = await axios.post("http://localhost:5000/api/referrals", payload, {
        headers: { 
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        toast.success("Referral posted successfully!");
        setFormData({
          company: "",
          position: "",
          description: "",
          requirements: "",
          location: "",
          type: "Full-time",
          referralLink: ""
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          toast.error(error.msg);
        });
      } else {
        toast.error("Failed to post referral");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300"
      >
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-yellow-100 rounded-xl"
          >
            <Briefcase className="w-6 h-6 text-yellow-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800">Post a Job Referral</h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" /> Company
              </label>
              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Google"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" /> Position
              </label>
              <input
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" /> Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Bangalore, India"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-gray-500" /> Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-500" /> Referral Link
            </label>
            <input
              name="referralLink"
              value={formData.referralLink}
              onChange={handleChange}
              placeholder="https://referral.example.com"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief about the job and role"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              rows={4}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-gray-500" /> Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              placeholder="E.g., React, Node.js, MongoDB"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              rows={3}
            />
            <p className="text-xs text-gray-500">Separate with commas (e.g., React, Node.js)</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 rounded-xl bg-yellow-500 text-gray-900 font-medium hover:bg-yellow-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2 group"
          >
            Post Referral
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Send className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
