import React from "react";
import { motion } from "framer-motion";
import { Play, Github } from "lucide-react";

const projects = [
  {
    title: "Power BI Investor Dashboard",
    description: "A real-time dashboard for a 1 MW solar farm with Excel integration.",
    link: "https://github.com/yourusername/solar-dashboard",
  },
  {
    title: "Real-time Dash Cam Streaming",
    description: "A cloud-based streaming service for dash cam footage.",
    link: "https://github.com/yourusername/dashcam-streaming",
  },
];

export default function Portfolio() {
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-center tracking-wider">Sai Kumar P's Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gray-900 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700 opacity-20"></div>
            <div className="relative p-6">
              <h2 className="text-3xl font-bold text-white">{project.title}</h2>
              <p className="text-gray-300 my-3">{project.description}</p>
              <div className="flex space-x-4 mt-4">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                  <Github className="mr-2" /> View on GitHub
                </a>
                <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                  <Play className="mr-2" /> Demo
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
