
"use client";

import { useState, useEffect, useCallback, ComponentType } from 'react';
import { generateQuote, type GenerateQuoteOutput, type GenerateQuoteInput } from '@/ai/flows/generate-quote';
import QuoteDisplay from '@/components/quote-display';
import NewQuoteButton from '@/components/new-quote-button';
import FlowerAnimation from '@/components/flower-animation';
import WaterRippleEffect from '@/components/water-ripple-effect';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import DefaultAnimatedBackground from '@/components/backgrounds/DefaultAnimatedBackground';
import SunriseBackground from '@/components/backgrounds/SunriseBackground';
import CloudyBackground from '@/components/backgrounds/CloudyBackground';
import TechyBackground from '@/components/backgrounds/TechyBackground';
import AscendBackground from '@/components/backgrounds/AscendBackground';


interface MoodObject {
  label: 'Motivational' | 'Funny' | 'Love' | 'Sad' | 'Scientific';
  emoji: string;
}

const moods: MoodObject[] = [
  { label: 'Motivational', emoji: '🎯' },
  { label: 'Funny', emoji: '🤣' },
  { label: 'Love', emoji: '🩷' },
  { label: 'Sad', emoji: '😔' },
  { label: 'Scientific', emoji: '🔬' },
];

type MoodLabel = MoodObject['label'];

export default function HomePage() {
  const [quoteData, setQuoteData] = useState<GenerateQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true); // For subsequent loads and initial QuoteDisplay skeleton logic
  const [isInitialLoading, setIsInitialLoading] = useState(true); // For splash screen
  const [isFlowerAnimationActive, setIsFlowerAnimationActive] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>('Motivational'); // Default to Motivational
  const { toast } = useToast();

  const getSubtitleColor = useCallback((mood: MoodLabel | null): string => {
    if (mood === 'Motivational') return 'text-primary';
    if (mood === 'Funny') return 'text-accent';
    if (mood === 'Love') return 'text-chart-1';
    if (mood === 'Sad') return 'text-foreground';
    if (mood === 'Scientific') return 'text-accent';
    return 'text-muted-foreground';
  }, []);

  const [BackgroundComponent, setBackgroundComponent] = useState<ComponentType | null>(() => AscendBackground); // Default to Motivational background
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [subtitleColorClass, setSubtitleColorClass] = useState(getSubtitleColor('Motivational')); // Default to Motivational subtitle color


  const fetchQuoteAndAnimate = useCallback(async (moodToFetch?: MoodLabel | null) => {
    setIsLoading(true);

    const finalMood = moodToFetch !== undefined ? moodToFetch : selectedMood;
    const input: GenerateQuoteInput = { seed: Math.random() };
    if (finalMood) {
      input.mood = finalMood;
    }

    let newBgComponent: ComponentType | null = DefaultAnimatedBackground;
    let grayscaleActive = false;

    if (finalMood === 'Sad') {
      newBgComponent = CloudyBackground;
      grayscaleActive = true;
    } else if (finalMood === 'Motivational') {
      newBgComponent = AscendBackground;
    } else if (finalMood === 'Love') {
      newBgComponent = SunriseBackground;
    } else if (finalMood === 'Scientific') {
      newBgComponent = TechyBackground;
    } else if (finalMood === 'Funny'){ // Funny also gets default for now, or its own if defined
      newBgComponent = DefaultAnimatedBackground; // Or a specific funny background
    }


    setBackgroundComponent(() => newBgComponent);
    setIsGrayscale(grayscaleActive);
    setSubtitleColorClass(getSubtitleColor(finalMood));

    try {
      const newQuote = await generateQuote(input);
      setIsFlowerAnimationActive(true);
      setQuoteData(newQuote);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to fetch a new quote. Please try again.",
        variant: "destructive",
      });
      // Reset to default if error
      setBackgroundComponent(() => DefaultAnimatedBackground);
      setIsGrayscale(false);
      setSubtitleColorClass(getSubtitleColor(null));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsFlowerAnimationActive(false);
      }, 6000);
    }
  }, [toast, selectedMood, getSubtitleColor]);

  useEffect(() => {
    const loadInitialQuote = async () => {
      setIsLoading(true);
      setIsInitialLoading(true); // Ensure splash is shown

      // Set initial theme elements for Motivational mood
      setBackgroundComponent(() => AscendBackground);
      setIsGrayscale(false);
      setSubtitleColorClass(getSubtitleColor('Motivational'));

      try {
        const newQuote = await generateQuote({ seed: Math.random(), mood: 'Motivational' });
        setQuoteData(newQuote);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message);
          toast({
            title: "Error",
            description: "Failed to fetch initial quote: " + e.message,
            variant: "destructive",
          });
        } else {
           console.error("An unknown error occurred", e);
           toast({
            title: "Error",
            description: "Failed to fetch initial quote. Please try again.",
            variant: "destructive",
          });
        }
         // Fallback to default theme elements on error
        setBackgroundComponent(() => DefaultAnimatedBackground);
        setSubtitleColorClass(getSubtitleColor(null));

      } finally {
        setIsLoading(false);
        setIsInitialLoading(false); // Remove splash screen
      }
    };
    loadInitialQuote();
  }, [toast, getSubtitleColor]); // getSubtitleColor added to dependencies

  const handleMoodSelect = (moodLabel: MoodLabel) => {
    setSelectedMood(moodLabel);
    let newBgComponent: ComponentType | null = DefaultAnimatedBackground;
    let grayscaleActive = false;
    if (moodLabel === 'Sad') {
      newBgComponent = CloudyBackground;
      grayscaleActive = true;
    } else if (moodLabel === 'Motivational') {
      newBgComponent = AscendBackground;
    } else if (moodLabel === 'Love') {
      newBgComponent = SunriseBackground;
    } else if (moodLabel === 'Scientific') {
      newBgComponent = TechyBackground;
    } else if (moodLabel === 'Funny'){
      newBgComponent = DefaultAnimatedBackground;
    }
    setBackgroundComponent(() => newBgComponent);
    setIsGrayscale(grayscaleActive);
    setSubtitleColorClass(getSubtitleColor(moodLabel));
  };

  if (isInitialLoading) {
    return (
      <>
        {BackgroundComponent && (
          <div className="fixed inset-0 z-[-1]">
            <BackgroundComponent />
          </div>
        )}
        <div
          className={cn(
            "flex flex-col items-center justify-center min-h-screen p-4 text-center bg-transparent text-foreground relative",
            isGrayscale ? 'grayscale-filter' : ''
          )}
        >
          <WaterRippleEffect />
          <div className="flex flex-col items-center justify-center">
            <p className="text-3xl font-semibold animate-pulse text-primary">
              Generating new Quote by Suyash… 😄
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {BackgroundComponent && (
        <div className="fixed inset-0 z-[-1]">
          <BackgroundComponent />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-screen p-4 text-center bg-transparent text-foreground relative",
          "transition-all duration-700 ease-in-out",
          isGrayscale ? 'grayscale-filter' : ''
        )}
      >
        <WaterRippleEffect />
        <FlowerAnimation isActive={isFlowerAnimationActive} />

        <header className="py-8 relative z-10">
          <h1 className="text-5xl font-bold text-primary tracking-tight">
            QuoteFlow
          </h1>
          <p className={cn("mt-2 text-lg transition-colors duration-300 ease-in-out", subtitleColorClass)}>
            Your daily dose of inspiration
          </p>
        </header>

        <main className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl px-4 relative z-10">
          <div className="mb-6 relative z-10">
            <h2 className="text-xl font-semibold text-foreground mb-3">Choose a Mood:</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.label}
                  variant={selectedMood === mood.label ? "default" : "outline"}
                  onClick={() => handleMoodSelect(mood.label)}
                  className={cn(
                    "capitalize px-4 py-2 w-36 rounded-full shadow-sm transition-all duration-150 ease-in-out",
                    selectedMood === mood.label ? "bg-primary text-primary-foreground scale-105" : "bg-secondary/70 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/90"
                  )}
                  aria-label={`Select ${mood.label} mood`}
                >
                  {selectedMood === mood.label ? mood.emoji : mood.label}
                </Button>
              ))}
            </div>
          </div>
          <QuoteDisplay quote={quoteData?.quote} author={quoteData?.author} isLoading={isLoading} />
          <NewQuoteButton onClick={() => fetchQuoteAndAnimate()} isLoading={isLoading} />
        </main>

        <footer className="w-full py-6 mt-auto text-center relative z-10">
          <p className="text-sm text-muted-foreground">
            Powered by GenAI &amp; Next.js
          </p>
        </footer>
      </div>
    </>
  );
}
