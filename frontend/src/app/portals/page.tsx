"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ShoppingCart, BarChart2 } from "lucide-react";
import Link from "next/link";

//temporary Home Page
export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-green-800">
          Welcome to Fasal Mitra
        </h1>
        <p className="text-green-700/80 mt-4 text-xl">
          Your trusted platform for agricultural contracts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-800">
              <FileText className="h-8 w-8 mr-2 text-green-600" />
              Farmer Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-green-700/80">
              Access available contracts and manage your farm operations.
            </p>
            <Link href="/farmer" className="block">
              <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300">
                Enter Farmer Portal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-800">
              <ShoppingCart className="h-8 w-8 mr-2 text-green-600" />
              Buyer Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-green-700/80">
              Manage your active contracts and create new purchase orders.
            </p>
            <Link href="/buyer" className="block">
              <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300">
                Enter Buyer Portal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-green-800">
              <BarChart2 className="h-8 w-8 mr-2 text-green-600" />
              Company Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-green-700/80">
              Oversee contract management and analyze market trends.
            </p>
            <Link href="/company" className="block">
              <Button className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300">
                Enter Company Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
