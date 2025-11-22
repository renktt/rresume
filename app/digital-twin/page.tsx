'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedVoiceAI from '@/components/EnhancedVoiceAI';
import ChatBot from '@/components/ChatBot';
import { Brain, MessageSquare, Mic, Sparkles, Zap, Shield } from 'lucide-react';

export default function DigitalTwinPage() {
  const [activeMode, setActiveMode] = useState<'chat' | 'voice'>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-highlight to-secondary dark:from-dark-highlight dark:to-dark-secondary rounded-full">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="section-title mb-4">Meet My Digital Twin</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Powered by advanced AI, my digital twin can answer questions about my experience, 
            skills, projects, and availability. Choose your preferred way to interact!
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <div className="inline-flex p-3 bg-accent dark:bg-dark-accent rounded-lg mb-4">
              <Sparkles className="w-6 h-6 text-highlight dark:text-dark-highlight" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with Groq AI and RAG technology for accurate, context-aware responses
            </p>
          </div>
          <div className="card text-center">
            <div className="inline-flex p-3 bg-accent dark:bg-dark-accent rounded-lg mb-4">
              <Zap className="w-6 h-6 text-highlight dark:text-dark-highlight" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get instant responses through text chat or natural voice conversation
            </p>
          </div>
          <div className="card text-center">
            <div className="inline-flex p-3 bg-accent dark:bg-dark-accent rounded-lg mb-4">
              <Shield className="w-6 h-6 text-highlight dark:text-dark-highlight" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your conversations are secure and used only to provide better responses
            </p>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-accent dark:bg-dark-accent rounded-lg p-1">
            <button
              onClick={() => setActiveMode('chat')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeMode === 'chat'
                  ? 'bg-highlight text-white dark:bg-dark-highlight'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-background dark:hover:bg-dark-background'
              }`}
            >
              <MessageSquare size={20} />
              <span>Text Chat</span>
            </button>
            <button
              onClick={() => setActiveMode('voice')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeMode === 'voice'
                  ? 'bg-highlight text-white dark:bg-dark-highlight'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-background dark:hover:bg-dark-background'
              }`}
            >
              <Mic size={20} />
              <span>Voice Chat</span>
            </button>
          </div>
        </motion.div>

        {/* AI Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {activeMode === 'chat' ? (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-highlight dark:text-dark-highlight mb-2">
                  Chat with My Digital Twin
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Ask me anything about my skills, experience, projects, or availability. 
                  I can provide detailed information and help you get to know my work better.
                </p>
              </div>
              <ChatBot 
                context="Main digital twin page. Provide comprehensive information about Renante's professional background, technical skills, projects, and career goals. Be helpful, friendly, and informative."
              />
            </div>
          ) : (
            <div className="card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-highlight dark:text-dark-highlight mb-2">
                  Talk to My Digital Twin
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Click the microphone button to start a voice conversation. 
                  My digital twin will listen to your questions and respond with voice.
                </p>
                <div className="bg-accent dark:bg-dark-accent rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">💡 Tips for Voice Chat:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Speak clearly and at a normal pace</li>
                    <li>• Ask one question at a time</li>
                    <li>• Wait for the response before asking another question</li>
                    <li>• You can ask about my skills, experience, projects, or contact information</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center">
                <EnhancedVoiceAI
                  greeting="Hello! I'm Renante's digital twin. You can ask me about his skills, experience, projects, or how to get in touch. What would you like to know?"
                  context="Main digital twin page. Provide comprehensive information about Renante's professional background, technical skills, projects, education, and contact information. Be conversational and helpful."
                  autoGreet={false}
                  buttonText="Start Voice Conversation"
                  sessionId="digital_twin_page_voice"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Example Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="card">
            <h3 className="text-xl font-bold text-highlight dark:text-dark-highlight mb-4">
              Example Questions You Can Ask:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">About Experience:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• "What's your current work experience?"</li>
                  <li>• "Tell me about your internship"</li>
                  <li>• "What freelance work have you done?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">About Skills:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• "What technologies do you know?"</li>
                  <li>• "Are you experienced with AI development?"</li>
                  <li>• "What's your expertise in web development?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">About Projects:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• "What projects have you built?"</li>
                  <li>• "Tell me about your e-commerce platform"</li>
                  <li>• "What's the digital twin system you created?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">About Availability:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• "Are you available for work?"</li>
                  <li>• "How can I contact you?"</li>
                  <li>• "What's your email address?"</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
