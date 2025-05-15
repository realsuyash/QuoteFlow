
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface QuoteDisplayProps {
  quote: string | undefined | null;
  isLoading: boolean;
}

export default function QuoteDisplay({ quote, isLoading }: QuoteDisplayProps) {
  const [displayQuote, setDisplayQuote] = useState<string | undefined | null>(null);
  const [animationKey, setAnimationKey] = useState(0); 

  useEffect(() => {
    if (!isLoading && quote) {
      if (quote !== displayQuote) {
        setDisplayQuote(quote);
        setAnimationKey(prev => prev + 1);
      }
    } else if (isLoading && !displayQuote) {
      // Initial load state, ensure displayQuote is null so skeleton shows
      setDisplayQuote(null); 
    }
    // If isLoading is true but displayQuote has a value, old quote remains visible.
    // If !isLoading and !quote (e.g. error), displayQuote remains as is (could be previous or null)
    // The "Welcome" message below handles the null displayQuote case when not loading.

  }, [quote, isLoading, displayQuote]);

  if (isLoading && !displayQuote) {
    return (
      <Card className="w-full mb-8 shadow-xl bg-card text-card-foreground rounded-lg">
        <CardContent className="p-8 min-h-[150px] flex items-center justify-center">
          <div className="space-y-3 w-full">
            <Skeleton className="h-6 w-full bg-muted/70" />
            <Skeleton className="h-6 w-5/6 bg-muted/70" />
            <Skeleton className="h-6 w-3/4 bg-muted/70" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-8 shadow-xl bg-card text-card-foreground rounded-lg">
      <CardContent className="p-8 min-h-[150px] flex items-center justify-center overflow-hidden">
        {displayQuote ? (
          <p
            key={animationKey}
            className="text-2xl lg:text-3xl italic text-center animate-fadeIn"
            aria-live="polite"
          >
            "{displayQuote}"
          </p>
        ) : (
          <p className="text-xl text-muted-foreground">
            {/* This message shows if initial load hasn't completed or if there's an error and no prior quote */}
            {!isLoading ? "Welcome! Click the button to get your first quote." : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
