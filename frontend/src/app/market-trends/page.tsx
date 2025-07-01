"use client";

import { motion } from "framer-motion";
import Layout from "../components/LandingLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  LineChart,
} from "lucide-react";

export default function MarketTrendsPage() {
  const trends = [
    {
      crop: "Wheat",
      trend: "up",
      change: "+5%",
      reason: "Increased global demand",
      icon: TrendingUp,
    },
    {
      crop: "Rice",
      trend: "down",
      change: "-2%",
      reason: "Oversupply in domestic market",
      icon: TrendingDown,
    },
    {
      crop: "Corn",
      trend: "up",
      change: "+3%",
      reason: "Growing use in biofuel production",
      icon: TrendingUp,
    },
    {
      crop: "Soybeans",
      trend: "up",
      change: "+4%",
      reason: "Rising demand in animal feed industry",
      icon: TrendingUp,
    },
    {
      crop: "Cotton",
      trend: "down",
      change: "-1%",
      reason: "Decreased textile industry demand",
      icon: TrendingDown,
    },
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
                d="M23 6l-9.5 9.5-5-5L1 18"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.path
                d="M17 6h6v6"
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
                  x1="1"
                  y1="6"
                  x2="23"
                  y2="18"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2563EB" />
                  <stop offset="1" stopColor="#22C55E" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent pt-16">
            Market Trends
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Stay updated with the latest agricultural market dynamics
          </p>
        </motion.div>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Recent Crop Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {trends.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span className="font-semibold">{item.crop}</span>
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      <item.icon
                        className={`h-5 w-5 mr-2 ${
                          item.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      />
                    </motion.div>
                    <span
                      className={
                        item.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {item.change}
                    </span>
                    <span className="ml-4 text-gray-600">({item.reason})</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-6 w-6 mr-2 text-blue-500" />
                  Price Forecasts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Projected prices for major crops in the upcoming season.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-6 w-6 mr-2 text-blue-500" />
                  Market Share Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Current market share distribution for key agricultural
                  products.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-6 w-6 mr-2 text-blue-500" />
                  Long-term Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Historical data and future projections for agricultural
                  markets.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
