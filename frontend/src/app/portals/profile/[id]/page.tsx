"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle, Calendar } from "lucide-react";

export default function PublicProfilePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const bio = searchParams.get("bio");
  const profileImage = searchParams.get("profile_image");
  const userVerified = searchParams.get("user_verified") === "true";
  const createdAt = searchParams.get("created_at");

  if (!name || !email || !type) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="border-b bg-gradient-to-r from-white/50 to-white/30 pb-8">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-green-200 shadow-xl mb-4">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium capitalize">
                  {type}
                </span>
                {userVerified && (
                  <span
                    className="flex items-center text-green-600"
                    title="Verified User"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </span>
                )}
              </div>
              <span className="text-gray-600">{email}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="rounded-lg bg-gradient-to-r from-white/80 to-white/50 border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4">
              {bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About
                  </h3>
                  <p className="text-gray-600">{bio}</p>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <span>
                  {createdAt
                    ? `Joined ${new Date(createdAt).toLocaleDateString()}`
                    : "Recently joined"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
