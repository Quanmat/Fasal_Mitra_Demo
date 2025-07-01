import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const LoadingCard = () => (
  <Card className="overflow-hidden border-0 bg-white/60 backdrop-blur-sm shadow-lg animate-pulse">
    <CardHeader className="h-20" />
    <CardContent>
      <div className="space-y-4">
        <div className="h-24 bg-gray-200/60 rounded" />
        <div className="h-10 bg-gray-200/60 rounded" />
      </div>
    </CardContent>
  </Card>
);
