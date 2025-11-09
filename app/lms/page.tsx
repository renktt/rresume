'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedVoiceAI from '@/components/EnhancedVoiceAI';
import { BookOpen, CheckCircle, Clock, Play, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  duration?: string;
  level?: string;
}

export default function LMSPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/lms/courses');
      const data = await res.json();
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('API did not return an array:', data);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId: number, newProgress: number) => {
    try {
      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, progress: newProgress }),
      });

      if (res.ok) {
        toast.success('Progress updated!');
        fetchCourses();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const completeCourse = async (courseId: number) => {
    try {
      const res = await fetch('/api/lms/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        toast.success('🎉 Course completed! Congratulations!');
        fetchCourses();
      }
    } catch (error) {
      console.error('Error completing course:', error);
      toast.error('Failed to complete course');
    }
  };

  const ongoingCourses = courses.filter(c => !c.completed);
  const completedCourses = courses.filter(c => c.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background dark:from-dark-background dark:via-dark-accent dark:to-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">Learning Management System</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            Track your learning journey with AI-powered guidance
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card text-center">
            <BookOpen className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{courses.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Total Courses</p>
          </div>

          <div className="card text-center">
            <Clock className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{ongoingCourses.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">In Progress</p>
          </div>

          <div className="card text-center">
            <Trophy className="text-highlight dark:text-dark-highlight mx-auto mb-4" size={48} />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{completedCourses.length}</h3>
            <p className="text-gray-600 dark:text-gray-400">Completed</p>
          </div>
        </motion.div>

        {/* Ongoing Courses */}
        {ongoingCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-highlight dark:text-dark-highlight mb-6">
              Ongoing Courses
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ongoingCourses.map((course) => (
                <div key={course.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.duration && `${course.duration} • `}
                        {course.level && course.level}
                      </p>
                    </div>
                    <Play className="text-highlight dark:text-dark-highlight" size={24} />
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-semibold text-highlight dark:text-dark-highlight">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-highlight dark:bg-dark-highlight transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateProgress(course.id, Math.min(course.progress + 10, 100))}
                      className="flex-1 btn-secondary text-sm"
                    >
                      Continue Learning
                    </button>
                    {course.progress === 100 && (
                      <button
                        onClick={() => completeCourse(course.id)}
                        className="btn-primary text-sm"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="btn-secondary text-sm"
                    >
                      AI Mentor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-highlight dark:text-dark-highlight mb-6">
              Completed Courses
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <div key={course.id} className="card opacity-75">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {course.title}
                    </h3>
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{course.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Voice AI Mentor */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card max-w-2xl mx-auto"
        >
          {selectedCourse ? (
            <>
              <button
                onClick={() => setSelectedCourse(null)}
                className="mb-4 text-gray-600 dark:text-gray-400 hover:text-highlight dark:hover:text-dark-highlight"
              >
                ← Back to courses
              </button>
              <h3 className="text-2xl font-bold text-center text-highlight dark:text-dark-highlight mb-4">
                AI Mentor: {selectedCourse.title}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Get personalized guidance and explanations for this course
              </p>
              <EnhancedVoiceAI
                buttonText="Talk to AI Mentor"
                context={`Course: ${selectedCourse.title}. Description: ${selectedCourse.description}. Progress: ${selectedCourse.progress}%. Act as a helpful tutor and guide the learner through this course.`}
                sessionId={`course_${selectedCourse.id}_voice`}
              />
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-center text-highlight dark:text-dark-highlight mb-6">
                AI Learning Mentor
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Get guidance on your learning journey and course recommendations
              </p>
              <EnhancedVoiceAI
                buttonText="Talk to AI Mentor"
                context="LMS page. Act as a learning mentor, providing guidance on courses, study tips, and motivation for continuous learning."
                sessionId="lms_page_voice"
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
