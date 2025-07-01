"use client";
import Link from "next/link";
import {
  Bell,
  Menu,
  User,
  LogOut,
  FileText,
  ShoppingCart,
  BarChart2,
  AlertCircle,
  CheckCircle2,
  Info,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { UserSearch } from "@/components/user-search";
import { LucideIcon } from "lucide-react";

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`group px-3 py-2 rounded-md flex items-center transition-all duration-200 ${
        isActive
          ? "text-green-700 bg-green-50/80"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      <Icon
        className={`h-5 w-5 mr-1 transition-transform group-hover:scale-110 duration-200 ${
          isActive ? "text-green-600" : ""
        }`}
      />
      {children}
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const hrefSegments = href.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);
    if (hrefSegments.length === 1) {
      return pathSegments[0] === hrefSegments[0] && pathSegments.length === 1;
    }
    return (
      href === pathname ||
      (pathSegments.length === hrefSegments.length &&
        pathSegments.every((segment, i) => segment === hrefSegments[i]))
    );
  };

  const getNavItems = () => {
    if (!user) return [];
    const userType = user.user_type;
    if (!userType) return [];

    switch (userType) {
      case "farmer":
        return [
          {
            href: "/farmer/contracts",
            icon: FileText,
            label: "Available Contracts",
          },
          {
            href: "/farmer/applications",
            icon: ClipboardList,
            label: "My Applications",
          },
          {
            href: "/farmer/my-disputes",
            icon: AlertCircle,
            label: "My Disputes",
          },
        ];
      case "buyer":
        return [
          { href: "/buyer", icon: ShoppingCart, label: "My Contracts" },
          { href: "/buyer/create", icon: PlusCircle, label: "Create Contract" },
        ];
      case "company":
        return [
          { href: "/company", icon: BarChart2, label: "My Contracts" },
          {
            href: "/company/applications",
            icon: ClipboardList,
            label: "Applications",
          },
          {
            href: "/company/create",
            icon: PlusCircle,
            label: "Create Contract",
          },
          {
            href: "/company/applications",
            icon: ClipboardList,
            label: "Applications",
          },
        ];
      default:
        return [];
    }
  };

  const notifications = [
    {
      id: 1,
      title: "New Contract Available",
      message: "A new wheat contract is available in Punjab region",
      time: "5 minutes ago",
      type: "info",
      icon: Info,
    },
    {
      id: 2,
      title: "Contract Approved",
      message: "Your rice contract #123 has been approved",
      time: "1 hour ago",
      type: "success",
      icon: CheckCircle2,
    },
    {
      id: 3,
      title: "Price Update",
      message: "Important price updates for corn contracts",
      time: "2 hours ago",
      type: "alert",
      icon: AlertCircle,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white border-b shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-semibold text-green-600">
                  फसल मित्र
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isActive={isLinkActive(item.href)}
                >
                  {item.label}
                </NavLink>
              ))}

              <UserSearch />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[380px]">
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      You have {notifications.length} unread messages
                    </p>
                  </div>
                  <Separator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex gap-3">
                          <notification.icon
                            className={`h-5 w-5 ${
                              notification.type === "success"
                                ? "text-green-500"
                                : notification.type === "alert"
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          />
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  isActive={isLinkActive(item.href)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
