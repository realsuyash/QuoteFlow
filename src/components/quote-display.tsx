
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface QuoteDisplayProps {
  quote: string | undefined | null;
  author?: string | undefined | null;
  isLoading: boolean;
}

export default function QuoteDisplay({ quote, author, isLoading }: QuoteDisplayProps) {
  const [displayQuote, setDisplayQuote] = useState<string | undefined | null>(null);
  const [displayAuthor, setDisplayAuthor] = useState<string | undefined | null>(null);
  const [animationKey, setAnimationKey] = useState(0); 

  useEffect(() => {
    if (!isLoading && quote) {
      if (quote !== displayQuote || author !== displayAuthor) {
        setDisplayQuote(quote);
        setDisplayAuthor(author);
        setAnimationKey(prev => prev + 1);
      }
    } else if (isLoading && !displayQuote) {
      // Initial load state, ensure displayQuote and displayAuthor are null so skeleton shows
      setDisplayQuote(null); 
      setDisplayAuthor(null);
    }
  }, [quote, author, isLoading, displayQuote, displayAuthor]);

  if (isLoading && !displayQuote) {
    return (
      <Card className="w-full mb-8 shadow-xl bg-card text-card-foreground rounded-lg">
        <CardContent className="p-8 min-h-[150px] flex flex-col items-center justify-center">
          <div className="space-y-3 w-full">
            <Skeleton className="h-6 w-full bg-muted/70" />
            <Skeleton className="h-6 w-5/6 bg-muted/70" />
            <Skeleton className="h-6 w-3/4 bg-muted/70" />
          </div>
          <Skeleton className="h-4 w-1/4 mt-4 bg-muted/70" /> 
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-8 shadow-xl bg-card text-card-foreground rounded-lg">
      <CardContent className="p-8 min-h-[150px] flex flex-col items-center justify-center overflow-hidden">
        {displayQuote ? (
          <>
            <p
              key={animationKey}
              className="text-2xl lg:text-3xl italic text-center animate-fadeIn"
              aria-live="polite"
            >
              "{displayQuote}"
            </p>
            {displayAuthor && (
              <p
                key={`${animationKey}-author`}
                className="text-md lg:text-lg mt-3 text-right w-full pr-4 animate-fadeIn"
                style={{ animationDelay: '0.2s' }} 
                aria-label={`quote by ${displayAuthor}`}
              >
                — {displayAuthor}
              </p>
            )}
          </>
        ) : (
          <p className="text-xl text-muted-foreground">
            {!isLoading ? "Welcome! Click the button to get your first quote." : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
