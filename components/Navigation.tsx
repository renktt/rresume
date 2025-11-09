'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { name: 'About Me', href: '/' },
  { name: 'Resume', href: '/resume' },
  { name: 'Projects', href: '/projects' },
  { name: 'LMS', href: '/lms' },
  { name: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-accent/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-highlight dark:text-dark-highlight">
              RM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-custom ${
                  pathname === item.href
                    ? 'bg-highlight text-white dark:bg-dark-highlight'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-accent dark:hover:bg-dark-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-lg bg-accent dark:bg-dark-secondary text-highlight dark:text-dark-highlight hover:bg-secondary dark:hover:bg-dark-accent transition-custom"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-accent dark:bg-dark-secondary text-highlight dark:text-dark-highlight"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-accent dark:hover:bg-dark-secondary transition-custom"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-accent shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg font-medium transition-custom ${
                  pathname === item.href
                    ? 'bg-highlight text-white dark:bg-dark-highlight'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-accent dark:hover:bg-dark-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
