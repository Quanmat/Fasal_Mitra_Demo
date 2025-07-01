"use client";

import { motion } from "framer-motion";
import Layout from "../components/LandingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function GuidelinesPage() {
  const guidelines = [
    "Ensure all contract details are thoroughly reviewed before applying.",
    "Maintain clear communication with buyers throughout the contract period.",
    "Adhere to the agreed-upon quality standards for all produce.",
    "Submit regular progress reports as specified in the contract.",
    "Follow sustainable farming practices to ensure long-term soil health.",
    "Properly document all expenses and transactions related to the contract.",
    "Attend all mandatory training sessions and workshops.",
    "Comply with local and national agricultural regulations.",
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
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="5"
                  y1="3"
                  x2="19"
                  y2="21"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent pt-16">
            Contract Guidelines
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Essential rules for successful contract farming
          </p>
        </motion.div>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Key Guidelines for Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {guidelines.map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
