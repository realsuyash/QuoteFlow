
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateQuote, type GenerateQuoteOutput } from '@/ai/flows/generate-quote';
import QuoteDisplay from '@/components/quote-display';
import NewQuoteButton from '@/components/new-quote-button';
import FlowerAnimation from '@/components/flower-animation';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Import cn utility

export default function HomePage() {
  const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlowerAnimationActive, setIsFlowerAnimationActive] = useState(false);
  const [visualEffect, setVisualEffect] = useState<'normal' | 'dimmed'>('normal'); // State for background effect
  const { toast } = useToast();

  const fetchQuoteAndAnimate = useCallback(async () => {
    setVisualEffect('dimmed'); // Dim the background
    setIsLoading(true);

    try {
      const newQuote = await generateQuote({ seed: Math.random() });
      setVisualEffect('normal'); // Brighten back to normal as flowers/quote appear
      setIsFlowerAnimationActive(true);
      setQuoteData(newQuote);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to fetch a new quote. Please try again.",
        variant: "destructive",
      });
      setVisualEffect('normal'); // Ensure visual effect resets on error
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsFlowerAnimationActive(false);
      }, 6000);
    }
  }, [toast]);

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
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground relative",
        "transition-all duration-700 ease-in-out", // For smooth filter transition
        visualEffect === 'dimmed' ? 'brightness-[0.6]' : 'brightness-100'
      )}
    >
      <FlowerAnimation isActive={isFlowerAnimationActive} />

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
