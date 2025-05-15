
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateQuote, type GenerateQuoteOutput } from '@/ai/flows/generate-quote';
import QuoteDisplay from '@/components/quote-display';
import NewQuoteButton from '@/components/new-quote-button';
import FlowerAnimation from '@/components/flower-animation'; // New import
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlowerAnimationActive, setIsFlowerAnimationActive] = useState(false); // State for flower animation
  const { toast } = useToast();

  // Fetches quote and triggers animation
  const fetchQuoteAndAnimate = useCallback(async () => {
    setIsLoading(true);
    setIsFlowerAnimationActive(true); // Start flower animation

    try {
      const newQuote = await generateQuote({ seed: Math.random() });
      setQuoteData(newQuote);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to fetch a new quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Set a timeout to stop the flower animation after it has played
      // Max animation delay (1.5s) + max duration (4s) = 5.5s. Hide after 6s.
      setTimeout(() => {
        setIsFlowerAnimationActive(false);
      }, 6000); 
    }
  }, [toast]);

  // Initial quote fetch on mount (without animation)
  useEffect(() => {
    const loadInitialQuote = async () => {
      setIsLoading(true);
      try {
        const newQuote = await generateQuote({ seed: Math.random() });
        setQuoteData(newQuote);
      } catch (e) {
        console.error(e);
        toast({
          title: "Error",
          description: "Failed to fetch initial quote. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialQuote();
  }, [toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground relative">
      {/* Flower animation component - z-index 0 */}
      <FlowerAnimation isActive={isFlowerAnimationActive} />

      {/* Content needs to be above flowers - z-index 10 */}
      <header className="py-8 relative z-10">
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          QuoteFlow
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your daily dose of inspiration</p>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl px-4 relative z-10">
        <QuoteDisplay quote={quoteData?.quote} isLoading={isLoading} />
        <NewQuoteButton onClick={fetchQuoteAndAnimate} isLoading={isLoading} />
      </main>

      <footer className="w-full py-6 mt-auto text-center relative z-10">
        <p className="text-sm text-muted-foreground">
          Powered by GenAI &amp; Next.js
        </p>
      </footer>
    </div>
  );
}
