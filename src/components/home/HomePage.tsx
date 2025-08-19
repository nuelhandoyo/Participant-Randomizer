import React from 'react';
import { Link } from 'react-router-dom';
import { Presentation, Users, Sparkles } from 'lucide-react';
import { HolographicCard } from '../shared/HolographicCard';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6 py-12">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white">
            Futuristic
            <span className="block text-cyan-400">Participant Randomizer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience magical participant selection with stunning 
            futuristic animations and real-time synchronization.
          </p>
        </div>

        {/* Interface Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/presenter">
            <HolographicCard 
              className="p-8 text-center hover:scale-105 transition-transform duration-300"
              glowColor="#00D4FF"
            >
              <div className="w-16 h-16 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                <Presentation className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Presenter Interface
              </h3>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Upload CSV files</li>
                <li>• Add participants manually</li>
                <li>• Control selection process</li>
                <li>• Export results</li>
                <li>• Real-time animation display</li>
              </ul>
              <div className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white font-semibold">
                Launch Presenter
              </div>
            </HolographicCard>
          </Link>

          <Link to="/participant">
            <HolographicCard 
              className="p-8 text-center hover:scale-105 transition-transform duration-300"
              glowColor="#8B5FFF"
            >
              <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Participant View
              </h3>
              <ul className="text-gray-300 space-y-2 text-left">
                <li>• Watch selection animation</li>
                <li>• Real-time synchronization</li>
                <li>• See selected participants</li>
                <li>• View timestamps</li>
                <li>• Full-screen experience</li>
              </ul>
              <div className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold">
                Join as Participant
              </div>
            </HolographicCard>
          </Link>
        </div>

        {/* Features */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HolographicCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">CSV Support</h3>
              <p className="text-gray-400">Import and export participant lists with timestamps</p>
            </HolographicCard>
            <HolographicCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Sync</h3>
              <p className="text-gray-400">Perfect synchronization between presenter and participant views</p>
            </HolographicCard>
            <HolographicCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Futuristic Magic</h3>
              <p className="text-gray-400">Stunning animations with particle effects</p>
            </HolographicCard>
          </div>
        </div>
      </div>
    </div>
  );
}