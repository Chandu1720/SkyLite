import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { MobileNav } from './MobileNav';
import { cn } from '../ui/Button';

import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Occasions', path: '/occasions' },
    { name: 'Theatres', path: '/theatres' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled ? "bg-brand-darker/90 backdrop-blur-md border-b border-gray-800 shadow-lg py-3" : "bg-transparent py-5"
      )}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-wider text-brand-gold">
              SKY<span className="text-white">LITE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-gold font-body",
                  location.pathname === link.path ? "text-brand-gold" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden md:block">
              <Link to="/book">
                <Button variant="primary" size="sm">Book Now</Button>
              </Link>
            </div>

            <button 
              className="md:hidden text-gray-300 hover:text-brand-gold ml-1 p-1.5"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} links={links} />
    </>
  );
};
