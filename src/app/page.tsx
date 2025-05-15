
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateQuote, type GenerateQuoteOutput } from '@/ai/flows/generate-quote';
import QuoteDisplay from '@/components/quote-display';
import NewQuoteButton from '@/components/new-quote-button';
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using Math.random() for seed to get varied quotes as per original flow's design.
      const newQuote = await generateQuote({ seed: Math.random() });
      setQuoteData(newQuote);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to fetch a new quote. Please try again.",
        variant: "destructive",
      });
      // Optionally clear old quote or keep it:
      // setQuoteData(null); 
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]); // Fetch initial quote on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground">
      <header className="py-8">
        <h1 className="text-5xl font-bold text-primary tracking-tight">
          QuoteFlow
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your daily dose of inspiration</p>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl px-4">
        <QuoteDisplay quote={quoteData?.quote} isLoading={isLoading} />
        <NewQuoteButton onClick={fetchQuote} isLoading={isLoading} />
      </main>

      <footer className="w-full py-6 mt-auto text-center">
        <p className="text-sm text-muted-foreground">
          Powered by GenAI &amp; Next.js
        </p>
      </footer>
    </div>
  );
}
