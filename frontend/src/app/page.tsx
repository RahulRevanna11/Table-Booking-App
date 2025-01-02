
'use client'
// export default TablesLayout;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, Clock, MapPin } from 'lucide-react';
import TablesLayout from './TablesLayout'
interface NavItem {
  label: string;
  href: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

const RestaurantLanding: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { label: 'Home', href: '#' },
    { label: 'Menu', href: '#menu' },
    { label: 'Reservations', href: '#reservations' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const contactInfo: ContactInfo = {
    phone: '1234567895',
    email: 'reservations@restaurant.com',
    address: '123 Dining Street, Food City, FC 12345',
    hours: 'Mon-Sun: 12:00 PM - 10:00 PM'
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-bold ${
                isScrolled ? 'text-purple-800' : 'text-white'
              }`}>
                Fine Dining
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-purple-800' 
                        : 'text-white hover:text-purple-200'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => window.location.href = '#reservations'}
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-800 hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ))}
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
                onClick={() => window.location.href = '#reservations'}
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./bg.jpg')"
        }}
      >
    <div 
  className="relative h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../public/bg.jpg')"
  }}
>
  <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
      Experience Fine Dining
    </h1>
    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
      Indulge in exquisite cuisine crafted with passion. Book your table today for an unforgettable dining experience.
    </p>
    <div className="space-x-4">
      <Button 
        className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6"
        onClick={() => window.location.href = '#reservations'}
      >
        Reserve a Table
      </Button>
      <Button 
        variant="outline"
        className="border-2 border-white text-white hover:bg-white hover:text-purple-800 text-lg px-8 py-6"
        onClick={() => window.location.href = '#menu'}
      >
        View Menu
      </Button>
    </div>
  </div>
</div>


        <main className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-12 bg-gray-500">
        <div id="reservations">
          {/* Your existing booking system component will go here */}
<TablesLayout></TablesLayout>
        </div>
      </main>
       
        {/* Quick Info Bar */}
        <div className=" bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-4 w-4" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-4 w-4" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Clock className="h-4 w-4" />
                <span>{contactInfo.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section (where your booking system will go) */}
    
    </div>
  );
};

export default RestaurantLanding;