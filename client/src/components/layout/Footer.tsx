import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-darker border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="SkyLite Logo" className="w-10 h-10 object-contain rounded-full shadow-md border border-blue-400/20" />
              <span className="font-heading text-2xl font-bold tracking-wider text-blue-500">
                SKY<span className="text-white">LITE</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm font-body leading-relaxed mb-6">
              Experience celebrations like never before in your own private cinema. Premium sound, spectacular screens, and customized decorations for your special moments.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/occasions" className="hover:text-blue-400 transition-colors">Occasions</Link></li>
              <li><Link to="/theatres" className="hover:text-blue-400 transition-colors">Theatres</Link></li>
              <li><Link to="/packages" className="hover:text-blue-400 transition-colors">Packages</Link></li>
              <li><Link to="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Contact Info</h4>
            <ul className="flex flex-col gap-4 font-body text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Near Hanuman Temple, Pappannareddy Layout, signal<br />Garvebhavi Palya, Bengaluru, Karnataka 560068</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:8008292789" className="hover:text-blue-400 transition-colors">
                    Phaneendra: +91 80082 92789
                  </a>
                  <a href="tel:9985631121" className="hover:text-blue-400 transition-colors">
                    Praveen: +91 99856 31121
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span>hello@skylite.com</span>
              </li>
            </ul>
          </div>

          {/* <div>
            <h4 className="font-heading text-lg text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm font-body mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-brand-dark border border-gray-700 rounded-l-md px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-brand-gold" />
              <button className="bg-brand-gold text-brand-darker px-4 py-2 text-sm font-semibold rounded-r-md hover:bg-yellow-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-body">
          <p>&copy; {new Date().getFullYear()} SkyLite Private Theatre. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/cancellation" className="hover:text-gray-300">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
