
"use client";

import { useState, useEffect, useCallback } from 'react';
import { generateQuote, type GenerateQuoteOutput, type GenerateQuoteInput } from '@/ai/flows/generate-quote';
import QuoteDisplay from '@/components/quote-display';
import NewQuoteButton from '@/components/new-quote-button';
import FlowerAnimation from '@/components/flower-animation';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const moods = ['Motivational', 'Funny', 'Love', 'Sad', 'Scientific'] as const;
type Mood = typeof moods[number];

export default function HomePage() {
  const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlowerAnimationActive, setIsFlowerAnimationActive] = useState(false);
  const [visualEffect, setVisualEffect] = useState<'normal' | 'dimmed'>('normal');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { toast } = useToast();

  const fetchQuoteAndAnimate = useCallback(async (moodToFetch?: Mood | null) => {
    setVisualEffect('dimmed');
    setIsLoading(true);

    const finalMood = moodToFetch !== undefined ? moodToFetch : selectedMood;
    const input: GenerateQuoteInput = { seed: Math.random() };
    if (finalMood) {
      input.mood = finalMood;
    }

    try {
      const newQuote = await generateQuote(input);
      setVisualEffect('normal');
      setIsFlowerAnimationActive(true);
      setQuoteData(newQuote);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to fetch a new quote. Please try again.",
        variant: "destructive",
      });
      setVisualEffect('normal');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsFlowerAnimationActive(false);
      }, 6000);
    }
  }, [toast, selectedMood]);

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

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    // No longer fetching quote here, only setting the mood.
    // The "New Quote" button will use this selectedMood.
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background text-foreground relative",
        "transition-all duration-700 ease-in-out",
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
        <div className="mb-6 relative z-10">
          <h2 className="text-xl font-semibold text-foreground mb-3">Choose a Mood:</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {moods.map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  "capitalize px-4 py-2 rounded-full shadow-sm transition-all duration-150 ease-in-out",
                  selectedMood === mood ? "bg-primary text-primary-foreground scale-105" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {mood}
              </Button>
            ))}
          </div>
        </div>
        <QuoteDisplay quote={quoteData?.quote} isLoading={isLoading} />
        <NewQuoteButton onClick={() => fetchQuoteAndAnimate()} isLoading={isLoading} />
      </main>

      <footer className="w-full py-6 mt-auto text-center relative z-10">
        <p className="text-sm text-muted-foreground">
          Powered by GenAI &amp; Next.js
        </p>
      </footer>
    </div>
  );
}
