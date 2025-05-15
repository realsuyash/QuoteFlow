
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
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
  const [isTTSSupported, setIsTTSSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsTTSSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && quote) {
      if (quote !== displayQuote || author !== displayAuthor) {
        setDisplayQuote(quote);
        setDisplayAuthor(author);
        setAnimationKey(prev => prev + 1);
      }
    } else if (isLoading && !displayQuote) {
      setDisplayQuote(null);
      setDisplayAuthor(null);
    }
  }, [quote, author, isLoading, displayQuote, displayAuthor]);

  const handleSpeak = () => {
    if (!isTTSSupported || !displayQuote) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop any currently playing speech
    }

    const utterance = new SpeechSynthesisUtterance(displayQuote);
    utterance.lang = 'en-US';
    // utterance.onend = () => console.log("Speech finished");
    // utterance.onerror = (event) => console.error("Speech error:", event);
    window.speechSynthesis.speak(utterance);
  };

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
            <div className="flex items-center justify-end w-full mt-3 pr-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {displayAuthor && (
                <p
                  key={`${animationKey}-author`}
                  className="text-md lg:text-lg"
                  aria-label={`quote by ${displayAuthor}`}
                >
                  — {displayAuthor}
                </p>
              )}
              {isTTSSupported && displayQuote && (
                <Button 
                  onClick={handleSpeak} 
                  variant="ghost" 
                  size="icon" 
                  className={`ml-2 ${!displayAuthor ? 'self-end' : ''}`} // Align if no author
                  aria-label="Speak quote"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}
            </div>
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
