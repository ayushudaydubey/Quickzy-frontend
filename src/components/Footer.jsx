import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white relative overflow-hidden">

      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10">

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
       
            <div className="lg:col-span-4">
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quickzy
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Redefining women's fashion with cutting-edge styles and uncompromising quality. Where trends meet timeless elegance.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="font-semibold mb-3">Stay in the loop</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 placeholder-gray-400"
                  />
                  <button className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-white">Explore</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Home', path: '#' },
                  { name: 'Shop All', path: '#' },
                  { name: 'New Arrivals', path: '#' },
                  { name: 'Sale', path: '#' },
                  { name: 'Cart', path: '#' }
                ].map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.path} 
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

    
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-white">Categories</h3>
              <ul className="space-y-4">
                {[
                  'Dresses',
                  'Tops & Blouses',
                  'Bottoms',
                  'Outerwear',
                  'Accessories'
                ].map((category) => (
                  <li key={category}>
                  
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {category}
                      </span>
                    
                  </li>
                ))}
              </ul>
            </div>

         
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
              <ul className="space-y-4">
                {[
                  'Contact Us',
                  'Size Guide',
                  'Shipping Info',
                  'Returns',
                  'FAQ'
                ].map((item) => (
                  <li key={item}>
                   
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {item}
                      </span>
                   
                  </li>
                ))}
              </ul>
            </div>

          
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-gray-300 text-sm">102001ayushdubey@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-gray-300 text-sm">+91 6266993726</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-gray-300 text-sm"> Indrapuri Sector-C Bhopal M.P </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
       
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-sm mr-4">Follow us:</span>
                {[
                  { Icon: Facebook, href: 'https://facebook.com' },
                  { Icon: Twitter, href: 'https://twitter.com' },
                  { Icon: Instagram, href: 'https://instagram.com' },
                  { Icon: Linkedin, href: 'https://linkedin.com' }
                ].map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Quickzy. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-2 text-xs text-gray-500">
                  <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                  <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                  <a href="/cookies" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;