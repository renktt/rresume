'use client';

import { motion } from 'framer-motion';
import EnhancedVoiceAI from '@/components/EnhancedVoiceAI';
import { User, GraduationCap, Code, Heart } from 'lucide-react';

export default function HomePage() {
  const greeting = "Hello! I'm Renante's digital twin. Welcome to this portfolio. I'm here to tell you about Renante Misador Marzan, a passionate BSIT student from Saint Paul University Philippines. Feel free to ask me anything about his skills, projects, or education!";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="section-title mb-4">About Me</h1>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-highlight to-secondary dark:from-dark-highlight dark:to-secondary flex items-center justify-center text-white text-5xl font-bold shadow-xl">
            RM
          </div>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card max-w-4xl mx-auto mb-12"
        >
          <div className="flex items-start space-x-4 mb-6">
            <User className="text-highlight dark:text-dark-highlight flex-shrink-0" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-highlight dark:text-dark-highlight mb-4">
                Renante Misador Marzan
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I am <strong>Renante Misador Marzan</strong>, a BSIT-4 student from{' '}
                <strong>Saint Paul University Philippines</strong>, majoring in{' '}
                <strong>Website Development</strong>, and currently taking{' '}
                <strong>Full Stack Development</strong>.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                I am passionate about technology, web design, and AI innovation. My goal is to 
                create innovative solutions that bridge the gap between cutting-edge technology 
                and user-friendly experiences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <GraduationCap className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Education</h3>
            <p className="text-gray-600 dark:text-gray-400">
              BSIT-4 at Saint Paul University Philippines
            </p>
          </div>

          <div className="card text-center">
            <Code className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Specialization</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Website Development & Full Stack
            </p>
          </div>

          <div className="card text-center">
            <Heart className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Passion</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Technology, Web Design & AI Innovation
            </p>
          </div>
        </motion.div>

        {/* Voice AI Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center text-highlight dark:text-dark-highlight mb-6">
            Meet My Digital Twin
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Experience an AI-powered conversation with my digital twin. Click below to start talking!
          </p>
          <EnhancedVoiceAI
            greeting={greeting}
            autoGreet={true}
            buttonText="Talk to My Twin"
            context="This is the About Me page. Provide information about Renante Misador Marzan's background, education, and interests."
            sessionId="about_page_voice"
          />
        </motion.div>
      </div>
    </div>
  );
}
