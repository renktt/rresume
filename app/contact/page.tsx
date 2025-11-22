'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedVoiceAI from '@/components/EnhancedVoiceAI';
import { Mail, Phone, MapPin, Send, Linkedin, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Get In Touch</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Let's connect! Send me a message or talk to my digital twin
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-highlight dark:text-dark-highlight mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="text-highlight dark:text-dark-highlight flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Email</h3>
                    <a href="mailto:renantemarzan11@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-highlight dark:hover:text-dark-highlight transition-colors">
                      renantemarzan11@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="text-highlight dark:text-dark-highlight flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Phone</h3>
                    <a href="tel:+639662253398" className="text-gray-600 dark:text-gray-400 hover:text-highlight dark:hover:text-dark-highlight transition-colors">
                      +63 9662253398
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Linkedin className="text-highlight dark:text-dark-highlight flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">LinkedIn</h3>
                    <a href="https://www.linkedin.com/in/renante-marzan-5245b639a/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-highlight dark:hover:text-dark-highlight transition-colors break-all">
                      linkedin.com/in/renante-marzan-5245b639a
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Facebook className="text-highlight dark:text-dark-highlight flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Facebook</h3>
                    <a href="https://www.facebook.com/renante.marzan.12" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-highlight dark:hover:text-dark-highlight transition-colors break-all">
                      facebook.com/renante.marzan.12
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice AI Section */}
            <div className="card">
              <h3 className="text-2xl font-bold text-center text-highlight dark:text-dark-highlight mb-6">
                Talk to My Digital Twin
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Have questions? My AI twin can answer them in real-time!
              </p>
              <EnhancedVoiceAI
                buttonText="Start Conversation"
                context="Contact page. Answer questions about contacting Renante, his availability, preferred communication methods, and general inquiries about his work."
                sessionId="contact_page_voice"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-highlight dark:text-dark-highlight mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary inline-flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
