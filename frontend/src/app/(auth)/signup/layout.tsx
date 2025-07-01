"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Mail, UserCheck, FileCheck, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

const steps = [
  {
    path: "/signup/verify-email",
    icon: Mail,
    title: "Verify Email",
  },
  {
    path: "/signup/user-info",
    icon: UserCheck,
    title: "User Info",
  },
  {
    path: "/signup/government-id",
    icon: FileCheck,
    title: "Verify ID",
  },
  {
    path: "/signup/additional-info",
    icon: MapPin,
    title: "Additional Info",
  },
];

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="min-h-screen w-full p-4 font-sans relative overflow-hidden bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
      <div className="mx-auto flex w-full items-center justify-center min-h-screen max-w-7xl relative z-10">
        <Card className="w-full max-w-3xl overflow-hidden shadow-xl bg-white/95 backdrop-blur-md border-0 rounded-2xl">
          <div className="p-8 lg:p-10 space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <Sprout className="h-10 w-10 text-green-600" />
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
                  फसल मित्र
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step.path}
                      className="flex flex-col items-center space-y-2.5"
                    >
                      <div
                        className={`
                          rounded-full p-2.5 transition-colors
                          ${
                            isCompleted
                              ? "bg-green-100 text-green-600"
                              : isCurrent
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span
                        className={`text-sm ${
                          isCurrent
                            ? "text-blue-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
