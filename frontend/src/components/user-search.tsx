"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { searchUsers } from "@/helpers/api";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/types/auth";
import { DialogTitle } from "@/components/ui/dialog";

export function UserSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<AuthUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length === 0) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(query);
        if (results) {
          setUsers(results);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setQuery("");
      setUsers([]);
    }
  };

  const handleSelect = (user: AuthUser) => {
    handleOpenChange(false);
    const params = new URLSearchParams({
      name:
        user.user_type === "company"
          ? user.company_name
          : `${user.first_name} ${user.last_name}`,
      email: user.email,
      type: user.user_type,
      user_verified: user.user_verified.toString(),
      profile_image:
        (user.user_type === "company"
          ? user.company_profile?.company_logo
          : user.farmer_profile?.profile_image ||
            user.buyer_profile?.profile_image ||
            "") || "",
      bio:
        (user.user_type === "company"
          ? user.company_profile?.company_description
          : user.farmer_profile?.bio || user.buyer_profile?.bio || "") || "",
      created_at:
        (user.user_type === "company"
          ? user.company_profile?.created_at
          : user.buyer_profile?.created_at) || "",
    }).toString();

    router.push(
      `/profile/${
        user.user_type === "company" ? user.company_name : user.email
      }?${params}`
    );
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-9 px-0"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search users</span>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <DialogTitle className="sr-only">Search Users</DialogTitle>
        <Command>
          <CommandInput
            placeholder="Search users..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {users.length === 0 && query && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {users.length > 0 && (
              <CommandGroup heading="Users">
                {users.map((user) => (
                  <CommandItem
                    key={user.email}
                    value={user.email}
                    onSelect={() => handleSelect(user)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.user_type === "company"
                          ? user.company_name
                          : `${user.first_name} ${user.last_name}`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
