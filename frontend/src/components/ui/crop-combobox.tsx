"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crop } from "@/types/crop";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface CropComboboxProps {
  crops: Crop[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function CropImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
      {isLoading && <Skeleton className="w-full h-full" />}
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
          {alt[0]}
        </div>
      )}
    </div>
  );
}

export function CropCombobox({
  crops,
  value,
  onChange,
  disabled = false,
}: CropComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Group crops by type
  const groupedCrops = React.useMemo(() => {
    return crops.reduce((acc, crop) => {
      const type =
        crop.crop_type.charAt(0).toUpperCase() + crop.crop_type.slice(1);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(crop);
      return acc;
    }, {} as Record<string, Crop[]>);
  }, [crops]);

  const selectedCrop = React.useMemo(
    () => crops.find((crop) => crop.id === value),
    [crops, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-green-200 bg-white/80 hover:bg-white/90 text-left font-normal"
          disabled={disabled}
        >
          {selectedCrop ? (
            <div className="flex items-center gap-2">
              <CropImage src={selectedCrop.image} alt={selectedCrop.name} />
              <span>{selectedCrop.name}</span>
            </div>
          ) : (
            "Select crop..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search crops..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={disabled}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No crop found.</CommandEmpty>
            {Object.entries(groupedCrops).map(([type, crops]) => {
              const filteredCrops = crops.filter((crop) =>
                crop.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredCrops.length === 0) return null;

              return (
                <CommandGroup key={type} heading={type}>
                  {filteredCrops.map((crop) => (
                    <CommandItem
                      key={crop.id}
                      value={crop.name}
                      onSelect={() => {
                        onChange(crop.id);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <CropImage src={crop.image} alt={crop.name} />
                        <span>{crop.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {crop.crop_type}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === crop.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
