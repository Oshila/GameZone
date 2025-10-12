"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Users,
  Trophy,
  Zap,
  ChevronRight,
  Menu,
  X,
  Check,
  ArrowRight,
  Gamepad2,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide for marketplace
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketplaceItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const marketplaceItems = [
    {
      title: "Merlin Marketplace",
      description: "Get premium CODM accounts, CP top-ups, and exclusive items at unbeatable prices",
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800",
      features: ["Legendary Accounts", "CP Top-Up", "Mythic Weapons", "Battle Pass"],
      price: "From ₦8,000",
      link: "https://wa.link/4zwtx9",
      gradient: "from-purple-600 to-blue-600"
    },
    {
      title: "Gaming Thumb Sleeves",
      description: "Professional gaming thumb sleeves for enhanced gameplay and precision control",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800",
      features: ["Sweat-proof", "Ultra Sensitive", "Anti-slip", "Universal Fit"],
      price: "₦2,000",
      link: "https://wa.link/nc4ese",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % marketplaceItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + marketplaceItems.length) % marketplaceItems.length);
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Registration",
      description:
        "Quick and seamless event registration process with secure payment integration",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Gaming Tournaments",
      description:
        "Join exciting COD, FIFA, and other gaming tournaments with real prizes",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Connect with fellow gamers and sports enthusiasts in your area",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Confirmation",
      description: "Get immediate confirmation and updates for all your registrations",
    },
  ];

  const upcomingEvents = [
    {
      title: "COD 2v2 Tournament",
      game: "Call of Duty",
      date: "Oct 25, 2025",
      slots: "10 Teams",
      prize: "₦50,000",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    },
    {
      title: "FIFA Championship",
      game: "FIFA 25",
      date: "Oct 30, 2025",
      slots: "20 Players",
      prize: "₦75,000",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    },
    {
      title: "Football 5v5 League",
      game: "Football",
      date: "Nov 5, 2025",
      slots: "8 Teams",
      prize: "₦100,000",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    },
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
        "Community Access",
      ],
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
        "VIP Access",
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GameZone
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#events"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Events
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Features
              </a>
              <a
                href="#marketplace"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Marketplace
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Pricing
              </a>
              <a
                href="/login"
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
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
              <a
                href="#events"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                Events
              </a>
              <a
                href="#features"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                Features
              </a>
              <a
                href="#marketplace"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                Marketplace
              </a>
              <a
                href="#pricing"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
                Pricing
              </a>
              <a
                href="/login"
                className="block text-gray-700 hover:text-purple-600 py-2"
              >
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
                  {"🎮 Nigeria's Premier Gaming Platform"}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Join The Ultimate
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  Gaming Experience
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Register for exciting gaming tournaments, sports events, and competitions. Connect
                with thousands of players across Nigeria.
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
                <Image
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
                  alt="Gaming Tournament"
                  width={800}
                  height={500}
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
              Why Choose{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GameZone
              </span>
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
              Upcoming{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tournaments
              </span>
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
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={192}
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

      {/* Marketplace Section */}
      <section id="marketplace" className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full mb-4">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Marketplace</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Level Up Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Gaming Gear
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium gaming products and services to enhance your performance
            </p>
          </div>

          {/* Slider */}
          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {marketplaceItems.map((item, idx) => (
                  <div key={idx} className="w-full flex-shrink-0">
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10">
                      <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Image Side */}
                        <div className="relative h-80 md:h-auto rounded-2xl overflow-hidden group">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={500}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-20`}></div>
                          <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
                            {item.price}
                          </div>
                        </div>

                        {/* Content Side */}
                        <div className="flex flex-col justify-center">
                          <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                          <p className="text-gray-300 mb-6 text-lg">{item.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-6">
                            {item.features.map((feature, featureIdx) => (
                              <div key={featureIdx} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient}`}></div>
                                <span className="text-gray-300 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <a
                            href={item.link}
                            className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${item.gradient} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition transform hover:scale-105`}
                          >
                            Shop Now <ArrowRight className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg hover:bg-white/20 p-3 rounded-full transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg hover:bg-white/20 p-3 rounded-full transition"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {marketplaceItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition ${
                    currentSlide === idx ? "bg-white w-8" : "bg-white/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Pricing
              </span>
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
                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl transform scale-105"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold mb-4">
                  ₦{plan.price}
                  <span className={`text-lg font-medium ml-1 ${plan.popular ? "text-white" : "text-gray-600"}`}>
                    /entry
                  </span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${plan.popular ? "text-white" : "text-purple-600"}`} />
                      <span className={plan.popular ? "text-white" : "text-gray-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold ${
                    plan.popular
                      ? "bg-white text-purple-600 hover:text-purple-800"
                      : "bg-purple-600 text-white hover:shadow-lg"
                  } transition`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold text-xl mb-4">GameZone</h4>
            <p className="text-gray-400">
              {"Nigeria's premier platform for gaming tournaments and sports competitions."}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-xl mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#events" className="hover:text-white">
                  Events
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-white">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-white">
                  Get Started
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xl mb-4">Contact</h4>
            <p>Email: support@gamezone.com</p>
            <p>Phone: +234 91 666 93315</p>
            <p className="mt-4 text-gray-500 text-sm">
              &copy; 2025 GameZone. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;