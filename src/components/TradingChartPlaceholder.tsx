'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Settings, Expand, Camera, BarChart2 } from 'lucide-react';

const timeframes = ["1M", "5M", "15M", "30M", "1H", "1D", "1W", "30D"];

export default function TradingChartPlaceholder() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <Tabs defaultValue="chart" className="w-auto">
                <TabsList className="grid grid-cols-4 h-8 text-xs p-0.5">
                    <TabsTrigger value="chart" className="h-full py-1 px-2 text-xs">Chart</TabsTrigger>
                    <TabsTrigger value="overview" className="h-full py-1 px-2 text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="news" className="h-full py-1 px-2 text-xs">News</TabsTrigger>
                    <TabsTrigger value="ai" className="h-full py-1 px-2 text-xs">AI</TabsTrigger>
                </TabsList>
            </Tabs>
            {/* Placeholder for future chart controls */}
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
                {timeframes.map(tf => (
                    <Button key={tf} variant="ghost" size="sm" className="px-2 py-1 h-7 text-xs text-muted-foreground hover:text-foreground">
                        {tf}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7"><BarChart2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Camera className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Expand className="h-4 w-4" /></Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-2 relative">
        {/* Adjust aspect ratio or height as needed */}
        <div className="relative w-full h-[400px] md:h-full min-h-[300px]">
          <Image
            src="https://placehold.co/1200x600/2A2E37/E0E0E0.png?text=Trading+Chart"
            alt="Trading Chart Placeholder"
            layout="fill"
            objectFit="cover"
            className="rounded"
            data-ai-hint="financial chart"
          />
        </div>
      </CardContent>
    </Card>
  );
}
