"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  BarChart2,
  Leaf,
  Star,
  BookOpen,
  Sprout,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Logo Section */}
      <div className="absolute top-0 left-0 m-4 z-20 flex items-center space-x-4 animate-fade-in">
        <Link href="/">
          <Image
            src="/logo.svg" // Replace with your logo file path
            alt="Fasal Mitra Logo"
            width={90} // Adjust size as needed
            height={90}
            className="hover:scale-105 transition-all duration-300"
          />
        </Link>
      </div>
      <div className="absolute top-0 right-0 m-4 z-20 flex space-x-4 animate-fade-in">
        <Link
          href="/login"
          className="bg-white/90 border border-blue-200 text-blue-600 px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm"
        >
          Login
        </Link>
        <Link
          href="/signup/user-info"
          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md"
        >
          Sign Up
        </Link>
      </div>

      <section className="relative h-screen flex items-center justify-center">
        <div className="banner"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 opacity-30"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            फसल मित्र
          </h1>
          <p className="text-xl md:text-2xl mb-10">
            Empowering farmers, connecting markets
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup/user-info"
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Link>
            <Link
              href="/tenders"
              className="bg-white/90 border border-blue-200 text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 inline-flex items-center"
            >
              View Tenders
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 animate-fade-in">
            Why Choose Fasal Mitra?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Users,
                title: "Connect Directly",
                description:
                  "Farmers and buyers interact without intermediaries",
              },
              {
                icon: BarChart2,
                title: "Market Insights",
                description: "Real-time data on crop prices and demand",
              },
              {
                icon: Leaf,
                title: "Sustainable Practices",
                description: "Promote and learn about eco-friendly farming",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-full p-6 inline-block mb-6 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-500">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-white animate-fade-in">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: "Rajesh Kumar",
                role: "Farmer",
                quote:
                  "Fasal Mitra has transformed the way I sell my crops. I now get better prices and have a wider market reach.",
              },
              {
                name: "Priya Sharma",
                role: "Buyer",
                quote:
                  "As a buyer, I appreciate the transparency and ease of finding quality produce directly from farmers.",
              },
            ].map((testimonial, index) => (
              <div
                key={`testimonial-${index}`}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Our Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { number: "10,000+", label: "Farmers Empowered" },
              { number: "₹50 Cr+", label: "Transaction Volume" },
              { number: "500+", label: "Active Buyers" },
            ].map((stat, index) => (
              <div
                key={`stat-${index}`}
                className="text-center hover:scale-105 transition-all duration-300"
              >
                <motion.p
                  className="text-5xl font-bold mb-2 text-green-600 animate-fade-in"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  {stat.number}
                </motion.p>
                <p className="text-xl text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-green-50 relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Explore Fasal Mitra
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: BookOpen,
                title: "Guidelines",
                description:
                  "Learn about best practices for successful agricultural contracts and transactions.",
                link: "/guidelines",
              },
              {
                icon: Sprout,
                title: "Resources",
                description:
                  "Access valuable resources to enhance your farming knowledge and techniques.",
                link: "/resources",
              },
              {
                icon: TrendingUp,
                title: "Market Trends",
                description:
                  "Stay updated with the latest agricultural market trends and price forecasts.",
                link: "/trends",
              },
            ].map((item, index) => (
              <div key={`explore-${index}`} className="text-center">
                <motion.div
                  className={`${
                    item.title === "Guidelines"
                      ? "bg-blue-100"
                      : item.title === "Resources"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  } rounded-full p-6 inline-block mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon
                    className={`w-12 h-12 ${
                      item.title === "Guidelines"
                        ? "text-blue-500"
                        : item.title === "Resources"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link
                  href={item.link}
                  className={`${
                    item.title === "Guidelines"
                      ? "text-blue-600 hover:text-blue-800"
                      : item.title === "Resources"
                      ? "text-green-600 hover:text-green-800"
                      : "text-yellow-600 hover:text-yellow-800"
                  } transition-colors`}
                >
                  {item.title === "Guidelines"
                    ? "Read Guidelines"
                    : item.title === "Resources"
                    ? "Explore Resources"
                    : "View Trends"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
