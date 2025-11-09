'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedVoiceAI from '@/components/EnhancedVoiceAI';
import { 
  User, GraduationCap, Code, Heart, Download, 
  Briefcase, Award, ExternalLink, Github,
  Mail, Phone, MapPin, Send, ChevronDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

interface ResumeItem {
  id: number;
  section: string;
  title: string;
  description: string;
  dateRange: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubLink?: string;
  demoLink?: string;
  imageUrl?: string;
  featured: boolean;
}

// Simple section wrapper without animations
function Section({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <section
      id={id}
      className="w-full flex items-center justify-center py-20"
    >
      <div className="w-full flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProjectsLoaded, setIsProjectsLoaded] = useState(false);

  useEffect(() => {
    fetchResumeData();
    
    // Lazy load projects when user approaches that section
    const timer = setTimeout(() => {
      fetchProjects();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchResumeData = async () => {
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      if (Array.isArray(data)) setResumeData(data);
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
        setIsProjectsLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const downloadResume = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(22);
    doc.text('Renante Misador Marzan', 105, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(12);
    doc.text('BSIT-4 | Website Development | Full Stack Development', 105, yPos, { align: 'center' });
    yPos += 15;

    const sections = ['Education', 'Skills', 'Experience', 'Certifications'];
    sections.forEach(section => {
      const items = resumeData.filter(item => item.section === section);
      if (items.length > 0) {
        doc.setFontSize(16);
        doc.text(section, 20, yPos);
        yPos += 8;

        items.forEach(item => {
          doc.setFontSize(12);
          doc.text(`${item.title} (${item.dateRange})`, 25, yPos);
          yPos += 6;
          doc.setFontSize(10);
          const lines = doc.splitTextToSize(item.description, 160);
          doc.text(lines, 25, yPos);
          yPos += lines.length * 5 + 5;

          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
        yPos += 5;
      }
    });

    doc.save('Renante_Marzan_Resume.pdf');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
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
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedData = resumeData.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ResumeItem[]>);

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Education': return <GraduationCap size={24} />;
      case 'Skills': return <Code size={24} />;
      case 'Experience': return <Briefcase size={24} />;
      case 'Certifications': return <Award size={24} />;
      default: return null;
    }
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section id="hero" className="w-full min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-accent via-background to-secondary dark:from-dark-accent dark:via-dark-background dark:to-dark-secondary relative py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="space-y-8">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-highlight to-secondary dark:from-dark-highlight dark:to-secondary flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              RM
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-highlight dark:text-dark-highlight tracking-tight">
                Renante Misador Marzan
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold text-gray-800 dark:text-gray-200">BSIT-4 Student</span> at Saint Paul University Philippines<br />
                Specializing in <span className="font-semibold text-highlight dark:text-dark-highlight">Website Development</span> & <span className="font-semibold text-highlight dark:text-dark-highlight">Full Stack Development</span>
              </p>
            </div>

            <div className="pt-4">
              <a
                href="#about"
                className="btn-primary inline-flex items-center space-x-2 px-8 py-3.5 text-base font-medium shadow-lg hover:shadow-xl"
              >
                <span>Meet My Digital Twin</span>
                <ChevronDown size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <Section id="about">
        <div className="w-full bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background py-4">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="section-title text-center mb-12">About Me</h2>

            {/* Bio Card */}
            <div className="card max-w-4xl mx-auto mb-10">
              <div className="flex items-start space-x-5">
                <User className="text-highlight dark:text-dark-highlight flex-shrink-0 mt-1" size={28} />
                <div className="space-y-4">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    I am passionate about technology, web design, and AI innovation. My goal is to 
                    create innovative solutions that bridge the gap between cutting-edge technology 
                    and user-friendly experiences.
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    With expertise in modern web technologies and a strong foundation in full-stack development,
                    I build responsive, scalable applications that solve real-world problems.
                  </p>
                </div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="card text-center">
                <GraduationCap className="text-highlight dark:text-dark-highlight mx-auto mb-3" size={40} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Education</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  BSIT-4 at Saint Paul University Philippines
                </p>
              </div>

              <div className="card text-center">
                <Code className="text-highlight dark:text-dark-highlight mx-auto mb-3" size={40} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Specialization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Website Development & Full Stack
                </p>
              </div>

              <div className="card text-center">
                <Heart className="text-highlight dark:text-dark-highlight mx-auto mb-3" size={40} />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Passion</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Technology, Web Design & AI Innovation
                </p>
              </div>
            </div>

            {/* Voice AI */}
            <div className="card max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-center text-highlight dark:text-dark-highlight mb-3">
                Meet My Digital Twin
              </h3>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                Experience an AI-powered conversation with my digital twin!
              </p>
              <EnhancedVoiceAI
                greeting="Hello! I'm Renante's digital twin. I'm here to tell you about Renante Misador Marzan, a passionate BSIT student from Saint Paul University Philippines."
                autoGreet={true}
                buttonText="Talk to My Twin"
                context="About Me section. Provide information about Renante's background, education, and interests."
                sessionId="about_section"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* RESUME SECTION */}
      <Section id="resume">
        <div className="w-full bg-gradient-to-br from-secondary via-background to-accent dark:from-dark-secondary dark:via-dark-background dark:to-dark-accent py-4">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-10">
              <h2 className="section-title mb-6">Resume</h2>
              <button
                onClick={downloadResume}
                className="btn-primary inline-flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="space-y-5 mb-8">
              {Object.keys(groupedData).map((section) => (
                <div key={section}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-highlight dark:text-dark-highlight">
                      {getSectionIcon(section)}
                    </div>
                    <h3 className="text-2xl font-bold text-highlight dark:text-dark-highlight">
                      {section}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {groupedData[section].map((item) => (
                      <div key={item.id} className="card">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {item.title}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                            {item.dateRange}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Voice AI */}
            <div className="card max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-center text-highlight dark:text-dark-highlight mb-4">
                Ask About My Qualifications
              </h3>
              <EnhancedVoiceAI
                buttonText="Explain My Resume"
                context="Resume section. Provide detailed information about Renante's qualifications."
                sessionId="resume_section"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* PROJECTS SECTION */}
      <Section id="projects">
        <div className="w-full bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background py-4">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="section-title text-center mb-12">Projects</h2>

            {selectedProject ? (
              <div className="card max-w-2xl mx-auto">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="mb-4 text-gray-600 dark:text-gray-400 hover:text-highlight"
                >
                  ← Back to projects
                </button>
                <h3 className="text-2xl font-bold text-center text-highlight dark:text-dark-highlight mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  {selectedProject.description}
                </p>
                <EnhancedVoiceAI
                  buttonText="Explain This Project"
                  context={`Project: ${selectedProject.title}. ${selectedProject.description}`}
                  sessionId={`project_${selectedProject.id}`}
                />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="card"
                    >
                      <div className="w-full h-28 bg-gradient-to-br from-highlight to-secondary rounded-lg mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                        {project.title.charAt(0)}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.split(',').slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 bg-accent dark:bg-dark-secondary text-xs rounded-full font-medium text-gray-700 dark:text-gray-300"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex space-x-2">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-highlight text-white rounded-lg hover:bg-opacity-90 transition-all"
                              title="View on GitHub"
                            >
                              <Github size={16} />
                            </a>
                          )}
                          {project.demoLink && (
                            <a
                              href={project.demoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-highlight text-white rounded-lg hover:bg-opacity-90 transition-all"
                              title="Live Demo"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-xs btn-secondary px-3 py-1.5"
                        >
                          Ask Twin
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card max-w-2xl mx-auto">
                  <h3 className="text-xl font-semibold text-center text-highlight dark:text-dark-highlight mb-4">
                    Ask About My Projects
                  </h3>
                  <EnhancedVoiceAI
                    buttonText="Discuss Projects"
                    context="Projects section. Discuss web development projects."
                    sessionId="projects_section"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* CONTACT SECTION */}
      <Section id="contact">
        <div className="w-full bg-gradient-to-br from-accent via-background to-secondary dark:from-dark-accent dark:via-dark-background dark:to-dark-secondary py-4">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="section-title text-center mb-12">Get In Touch</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold text-highlight dark:text-dark-highlight mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-highlight dark:text-dark-highlight" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Email</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">renante.marzan@example.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="text-highlight dark:text-dark-highlight" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Phone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">+63 XXX XXX XXXX</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="text-highlight dark:text-dark-highlight" size={20} />
                      <div>
                        <p className="text-sm font-semibold">Location</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Philippines</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-base font-semibold text-center text-highlight dark:text-dark-highlight mb-4">
                    Talk to My Digital Twin
                  </h3>
                  <EnhancedVoiceAI
                    buttonText="Start Conversation"
                    context="Contact section."
                    sessionId="contact_section"
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div className="card">
                <h3 className="text-lg font-semibold text-highlight dark:text-dark-highlight mb-6">
                  Send a Message
                </h3>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary inline-flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? <span>Sending...</span> : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
