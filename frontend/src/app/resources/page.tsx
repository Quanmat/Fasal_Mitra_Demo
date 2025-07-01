"use client";

import { motion } from "framer-motion";
import Layout from "../components/LandingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Video, FileText, LinkIcon } from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Sustainable Farming Techniques",
      type: "article",
      icon: FileText,
    },
    { title: "Crop Rotation Strategies", type: "video", icon: Video },
    { title: "Agricultural Finance Management", type: "ebook", icon: Book },
    { title: "Pest Control Best Practices", type: "webinar", icon: Video },
    { title: "Soil Health Assessment Guide", type: "pdf", icon: FileText },
    { title: "Weather Forecasting for Farmers", type: "tool", icon: LinkIcon },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          className="text-center relative"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="3"
                  y1="5"
                  x2="21"
                  y2="19"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent pt-16">
            Farmer Resources
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Valuable information to enhance your farming practices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      <resource.icon className="h-6 w-6 mr-2 text-blue-500" />
                    </motion.div>
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Type: {resource.type}
                  </p>
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    Access Resource
                    <LinkIcon className="h-4 w-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
