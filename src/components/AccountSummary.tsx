'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default function AccountSummary() {
  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-medium">ACCOUNT SUMMARY</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4">
        <InfoRow label="Buying Power" value="$0" />
        <InfoRow label="Available Margin" value="$0" />
        <InfoRow label="Leverage" value="0x" />
        <div className="flex gap-2 pt-2">
          <Button variant="secondary" size="sm" className="w-full h-8 text-xs">
            <Download className="mr-1.5 h-3 w-3" /> Deposit
          </Button>
          <Button variant="secondary" size="sm" className="w-full h-8 text-xs">
            <Upload className="mr-1.5 h-3 w-3" /> Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
