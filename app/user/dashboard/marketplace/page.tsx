"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Shield,
  Star,
  TrendingUp,
  Users,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Award,
  Zap,
  Crown,
} from "lucide-react";

type MarketItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  badge?: string;
  popular?: boolean;
  image?: string;
};

export default function MarketplacePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<"accounts" | "services" | "items">("accounts");

  const WHATSAPP_GROUP = "https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK"; // Replace with actual link
  const WHATSAPP_CONTACT = "2349166693315"; // Replace with marketplace contact

  const accounts: MarketItem[] = [
    {
      id: "acc1",
      title: "Legendary Ranked Account",
      description: "High-tier ranked account with exclusive skins and weapons",
      price: 25000,
      badge: "🔥 HOT",
      popular: true,
      features: [
        "Legendary Rank",
        "50+ Legendary Skins",
        "Mythic Weapons (3+)",
        "All Characters Unlocked",
        "High K/D Ratio (2.5+)",
        "Email Access Included",
      ],
    },
    {
      id: "acc2",
      title: "Master Tier Account",
      description: "Well-established account with premium content",
      price: 15000,
      badge: "⭐ BEST VALUE",
      features: [
        "Master Rank V",
        "30+ Epic Skins",
        "Multiple Legendary Weapons",
        "80% Weapons Unlocked",
        "Good Stats & History",
        "Secure Transfer",
      ],
    },
    {
      id: "acc3",
      title: "Pro Tier Starter",
      description: "Perfect for players looking to start strong",
      price: 8000,
      features: [
        "Pro Rank III",
        "15+ Rare/Epic Skins",
        "Several Epic Weapons",
        "Most Characters Available",
        "Clean Account History",
        "Email Changeable",
      ],
    },
    {
      id: "acc4",
      title: "Elite Collector's Account",
      description: "Rare account with discontinued items and skins",
      price: 40000,
      badge: "💎 RARE",
      features: [
        "Legendary+ Rank",
        "OG Season 1-3 Skins",
        "Multiple Mythics",
        "Rare Discontinued Items",
        "Complete Gun Collection",
        "VIP Treatment",
      ],
    },
  ];

  const services: MarketItem[] = [
    {
      id: "srv1",
      title: "Rank Boosting Service",
      description: "Professional rank boosting to your desired tier",
      price: 5000,
      features: [
        "Pro to Master: ₦5,000",
        "Master to Legendary: ₦8,000",
        "Safe & Secure Process",
        "2-5 Days Completion",
        "Professional Players",
        "Money-Back Guarantee",
      ],
    },
    {
      id: "srv2",
      title: "CP Top-Up Service",
      description: "Affordable COD Points at discounted rates",
      price: 3000,
      badge: "💰 DISCOUNT",
      features: [
        "800 CP: ₦3,000",
        "2400 CP: ₦8,000",
        "Instant Delivery",
        "Safe Transaction",
        "24/7 Support",
        "Best Rates Guaranteed",
      ],
    },
    {
      id: "srv3",
      title: "Account Recovery",
      description: "Recover banned or suspended accounts",
      price: 10000,
      features: [
        "Ban Appeal Assistance",
        "Account Investigation",
        "Success-Based Payment",
        "Legal Methods Only",
        "Experienced Team",
        "No Guarantee (Refund if Failed)",
      ],
    },
  ];

  const items: MarketItem[] = [
    {
      id: "itm1",
      title: "Mythic Weapon Bundle",
      description: "Get any mythic weapon of your choice",
      price: 12000,
      badge: "🎁 GIFT",
      features: [
        "Any Mythic Weapon",
        "Account Linking Service",
        "Safe Transfer Method",
        "24-Hour Delivery",
        "Warranty Included",
      ],
    },
    {
      id: "itm2",
      title: "Battle Pass Package",
      description: "Premium Battle Pass + 25 Tier Skip",
      price: 4500,
      popular: true,
      features: [
        "Current Season BP",
        "25 Tier Skip Included",
        "All Premium Rewards",
        "Instant Activation",
        "Secure Purchase",
      ],
    },
    {
      id: "itm3",
      title: "Lucky Draw Spins",
      description: "Professional lucky draw service with high win rate",
      price: 8000,
      features: [
        "10 Lucky Draw Spins",
        "Guaranteed Epic+",
        "Experienced Spinner",
        "Live Video Proof",
        "Best Odds Strategy",
      ],
    },
  ];

  const getCurrentItems = () => {
    switch (selectedCategory) {
      case "accounts":
        return accounts;
      case "services":
        return services;
      case "items":
        return items;
      default:
        return accounts;
    }
  };

  const handleContactWhatsApp = (item: MarketItem) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in: ${item.title}\nPrice: ₦${item.price.toLocaleString()}\n\nPlease provide more details.`
    );
    window.open(`https://wa.me/${WHATSAPP_CONTACT}?text=${message}`, "_blank");
  };

  const handleJoinGroup = () => {
    window.open(WHATSAPP_GROUP, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingCart className="text-blue-400" size={28} />
                  CODM Marketplace
                </h1>
                <p className="text-sm text-gray-300">Legit accounts, services & items</p>
              </div>
            </div>
            <button
              onClick={handleJoinGroup}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              <MessageCircle size={20} />
              Join WhatsApp Group
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Welcome to CODM Marketplace! 🎮</h2>
              <p className="text-gray-300 mb-4">
                Your trusted source for legitimate Call of Duty Mobile accounts, premium services, and exclusive items.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Shield className="text-green-400" size={20} />
                  <span className="text-sm">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <CheckCircle className="text-blue-400" size={20} />
                  <span className="text-sm">Verified Sellers</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                  <Star className="text-yellow-400" size={20} />
                  <span className="text-sm">Top Rated</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-4">
                <Sparkles className="mx-auto mb-2 text-yellow-400" size={32} />
                <p className="text-sm font-semibold">Special Offer!</p>
                <p className="text-xs text-gray-300">10% off first purchase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("accounts")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "accounts"
                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Crown size={20} />
            Premium Accounts
          </button>
          <button
            onClick={() => setSelectedCategory("services")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "services"
                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Zap size={20} />
            Services
          </button>
          <button
            onClick={() => setSelectedCategory("items")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "items"
                ? "bg-blue-600 text-white shadow-lg transform scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Award size={20} />
            Items & Bundles
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentItems().map((item) => (
            <div
              key={item.id}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                item.popular ? "border-yellow-500 border-2" : "border-white/10"
              }`}
            >
              {/* Badge */}
              {item.badge && (
                <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {item.badge}
                </div>
              )}

              {/* Title & Description */}
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-green-400">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleContactWhatsApp(item)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Contact on WhatsApp
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6">Why Choose Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="text-blue-400" size={32} />
              </div>
              <h4 className="font-semibold mb-2">100% Secure</h4>
              <p className="text-sm text-gray-400">All transactions are safe and protected</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h4 className="font-semibold mb-2">Verified Accounts</h4>
              <p className="text-sm text-gray-400">Every account is thoroughly checked</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-yellow-400" size={32} />
              </div>
              <h4 className="font-semibold mb-2">Trusted Community</h4>
              <p className="text-sm text-gray-400">500+ satisfied customers</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="text-purple-400" size={32} />
              </div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-sm text-gray-400">Competitive rates guaranteed</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Have questions? Join our community!</p>
          <button
            onClick={handleJoinGroup}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 inline-flex items-center gap-3"
          >
            <MessageCircle size={24} />
            Join WhatsApp Group Now
          </button>
        </div>
      </div>
    </div>
  );
}