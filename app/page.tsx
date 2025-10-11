"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Zap, ChevronRight, Menu, X, Star, Check, ArrowRight, Gamepad2, DollarSign } from 'lucide-react';

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Registration",
      description: "Quick and seamless event registration process with secure payment integration"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gaming Tournaments",
      description: "Join exciting COD, FIFA, and other gaming tournaments with real prizes"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Connect with fellow gamers and sports enthusiasts in your area"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Confirmation",
      description: "Get immediate confirmation and updates for all your registrations"
    }
  ];

  const upcomingEvents = [
    {
      title: "COD 2v2 Tournament",
      game: "Call of Duty",
      date: "Oct 25, 2025",
      slots: "10 Teams",
      prize: "₦50,000",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
    },
    {
      title: "FIFA Championship",
      game: "FIFA 25",
      date: "Oct 30, 2025",
      slots: "20 Players",
      prize: "₦75,000",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
    },
    {
      title: "Football 5v5 League",
      game: "Football",
      date: "Nov 5, 2025",
      slots: "8 Teams",
      prize: "₦100,000",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
    }
  ];

  const testimonials = [
    {
      name: "Chibuike A.",
      role: "Pro Gamer",
      comment: "Best platform for competitive gaming in Nigeria. Smooth registration and timely events!",
      rating: 5
    },
    {
      name: "Amina O.",
      role: "FIFA Champion",
      comment: "Won my first tournament here. The organization is top-notch and payments are instant.",
      rating: 5
    },
    {
      name: "David M.",
      role: "Team Captain",
      comment: "Great community and well-organized events. Highly recommend for all gamers!",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Standard Entry",
      price: "2,000",
      features: [
        "Event Registration",
        "Instant Confirmation",
        "Email Updates",
        "Participant Badge",
        "Community Access"
      ]
    },
    {
      name: "Premium Events",
      price: "5,000",
      features: [
        "All Standard Features",
        "Priority Registration",
        "Exclusive Tournaments",
        "Premium Support",
        "Special Prizes",
        "VIP Access"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GameVerse
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#events" className="text-gray-700 hover:text-purple-600 transition font-medium">
                Events
              </a>
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition font-medium">
                Pricing
              </a>
              <a href="/login" className="text-gray-700 hover:text-purple-600 transition font-medium">
                Login
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-105"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#events" className="block text-gray-700 hover:text-purple-600 py-2">
                Events
              </a>
              <a href="#features" className="block text-gray-700 hover:text-purple-600 py-2">
                Features
              </a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600 py-2">
                Pricing
              </a>
              <a href="/login" className="block text-gray-700 hover:text-purple-600 py-2">
                Login
              </a>
              <a
                href="/signup"
                className="block text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🎮 Nigeria's Premier Gaming Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Join The Ultimate
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Gaming Experience</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Register for exciting gaming tournaments, sports events, and competitions. Connect with thousands of players across Nigeria.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/signup"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105"
                >
                  Start Playing <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#events"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-purple-600 transition"
                >
                  View Events <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">5,000+</div>
                  <div className="text-gray-600">Active Players</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">200+</div>
                  <div className="text-gray-600">Events Hosted</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">₦5M+</div>
                  <div className="text-gray-600">Prizes Won</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
                  alt="Gaming Tournament"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Live Tournaments Daily</h3>
                  <p className="text-purple-200">Compete with the best players nationwide</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 p-6 rounded-2xl shadow-xl transform rotate-12 hover:rotate-6 transition">
                <Trophy className="w-8 h-8 mb-2" />
                <div className="font-bold">Win Big!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">GameVerse</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for an amazing gaming tournament experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-purple-600 transition hover:shadow-xl transform hover:-translate-y-2"
              >
                <div className="mb-4 inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl text-purple-600 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Tournaments</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Register now for the hottest gaming events
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    {event.prize}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-600 font-semibold mb-2">{event.game}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{event.slots}</span>
                    </div>
                  </div>
                  <a
                    href="/signup"
                    className="block text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your gaming journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl transform scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₦{plan.price}</span>
                  <span className={plan.popular ? 'text-purple-100' : 'text-gray-600'}> /event</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${plan.popular ? 'text-yellow-400' : 'text-purple-600'}`} />
                      <span className={plan.popular ? 'text-purple-50' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Players <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied gamers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Gaming Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of players and compete in the biggest tournaments
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition transform hover:scale-105"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">GameVerse</span>
              </div>
              <p className="text-gray-400">Nigeria's premier gaming tournament platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#events" className="hover:text-white transition">Events</a></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GameVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;