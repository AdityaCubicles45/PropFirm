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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />AI Risk Assessment</CardTitle>
        <CardDescription>
          {tokenName ? `Analysis for ${tokenName}` : 'Select a token to see its risk assessment.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        {!loading && error && (
          <p className="text-destructive">
            <Info className="inline mr-1 h-4 w-4" /> {error}
          </p>
        )}
        {!loading && !error && assessment && (
          <p className="text-sm">{assessment.riskAssessment}</p>
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
