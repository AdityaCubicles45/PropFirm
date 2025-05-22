'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SummaryItem: React.FC<{ label: string; value: string; subValue?: string; positive?: boolean; negative?: boolean }> = ({ label, value, subValue, positive, negative }) => (
  <div>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className={`text-sm font-semibold ${positive ? 'text-green-500' : negative ? 'text-red-500' : 'text-foreground'}`}>
      {value}
      {subValue && <span className="text-xs text-muted-foreground ml-1">{subValue}</span>}
    </div>
  </div>
);

export default function PortfolioSummary() {
  return (
    <Card className="mt-4">
      <CardContent className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
          <SummaryItem label="Portfolio Value" value="$0.000" />
          <SummaryItem label="PnL" value="0" subValue="(0.0000%)" positive={false} />
          <SummaryItem label="Leverage" value="0.00x" />
          <SummaryItem label="Xade Shards" value="0" />
          <SummaryItem label="$ORDER" value="0" />
        </div>
         <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8 text-xs p-0.5">
            <TabsTrigger value="positions" className="h-full py-1 text-xs">Positions</TabsTrigger>
            <TabsTrigger value="orders" className="h-full py-1 text-xs">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="positions" className="mt-2 text-center text-xs text-muted-foreground py-4">
            No open positions.
          </TabsContent>
          <TabsContent value="orders" className="mt-2 text-center text-xs text-muted-foreground py-4">
            No open orders.
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
