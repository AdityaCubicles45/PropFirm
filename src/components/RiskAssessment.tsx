// This component is not directly visible in the new primary trading UI.
// It could be integrated into an "AI" tab within the chart area later.
// For now, it will not be rendered on the main page.
// Keeping the file in case it's needed.

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, Info } from 'lucide-react';
import { getTokenRiskAssessment, type GetTokenRiskAssessmentOutput } from '@/ai/flows/token-risk-assessment';

interface RiskAssessmentProps {
  tokenName: string | null;
}

export default function RiskAssessment({ tokenName }: RiskAssessmentProps) {
  const [assessment, setAssessment] = useState<GetTokenRiskAssessmentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tokenName) {
      const fetchAssessment = async () => {
        setLoading(true);
        setError(null);
        setAssessment(null);
        try {
          const result = await getTokenRiskAssessment({ tokenName });
          setAssessment(result);
        } catch (err) {
          console.error("Error fetching risk assessment:", err);
          setError(err instanceof Error ? err.message : "Failed to fetch risk assessment.");
        } finally {
          setLoading(false);
        }
      };
      fetchAssessment();
    } else {
      setAssessment(null);
      setLoading(false);
      setError(null);
    }
  }, [tokenName]);
  
  // This component would typically be part of a tab or a dedicated section.
  // For this refactor, it's not directly placed on the main page.
  // The rendering logic below is kept if you decide to place it somewhere.
  return (
    <Card className="shadow-lg bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-base"><ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />AI Risk Assessment</CardTitle>
        <CardDescription className="text-xs">
          {tokenName ? `Analysis for ${tokenName}` : 'Select a token to see its risk assessment.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-muted/50" />
            <Skeleton className="h-4 w-1/2 bg-muted/50" />
          </div>
        )}
        {!loading && error && (
          <p className="text-destructive text-sm">
            <Info className="inline mr-1 h-4 w-4" /> {error}
          </p>
        )}
        {!loading && !error && assessment && (
          <p className="text-sm text-foreground">{assessment.riskAssessment}</p>
        )}
        {!loading && !error && !assessment && !tokenName && (
          <p className="text-sm text-muted-foreground">No token selected.</p>
        )}
         {!loading && !error && !assessment && tokenName && (
          <p className="text-sm text-muted-foreground">No assessment available for {tokenName}.</p>
        )}
      </CardContent>
    </Card>
  );
}
