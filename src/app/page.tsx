
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
import FunnyBackground from '@/components/backgrounds/FunnyBackground';


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
  const [isLoading, setIsLoading] = useState(true); 
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  
  const [isFlowerAnimationActive, setIsFlowerAnimationActive] = useState(false);
  const [isFunnyAnimationActive, setIsFunnyAnimationActive] = useState(false);
  const [isMotivationalAnimationActive, setIsMotivationalAnimationActive] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>('Motivational'); 
  const { toast } = useToast();

  const [isShaking, setIsShaking] = useState(false);

  const getSubtitleColor = useCallback((mood: MoodLabel | null): string => {
    if (mood === 'Motivational') return 'text-primary';
    if (mood === 'Funny') return 'text-accent';
    if (mood === 'Love') return 'text-chart-1'; 
    if (mood === 'Sad') return 'text-foreground';
    if (mood === 'Scientific') return 'text-accent';
    return 'text-muted-foreground';
  }, []);

  const [BackgroundComponent, setBackgroundComponent] = useState<ComponentType<{isActive?: boolean}> | null>(() => AscendBackground); 
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [subtitleColorClass, setSubtitleColorClass] = useState(getSubtitleColor('Motivational')); 


  const fetchQuoteAndAnimate = useCallback(async (moodToFetch?: MoodLabel | null) => {
    setIsLoading(true);
    // Reset all animation flags
    setIsFlowerAnimationActive(false);
    setIsFunnyAnimationActive(false);
    setIsMotivationalAnimationActive(false);

    const finalMood = moodToFetch !== undefined ? moodToFetch : selectedMood;
    const input: GenerateQuoteInput = { seed: Math.random() };
    if (finalMood) {
      input.mood = finalMood;
    }

    let newBgComponent: ComponentType<{isActive?: boolean}> | null = DefaultAnimatedBackground;
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
    } else if (finalMood === 'Funny'){ 
      newBgComponent = FunnyBackground;
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
    
    setBackgroundComponent(() => newBgComponent);
    setIsGrayscale(grayscaleActive);
    setSubtitleColorClass(getSubtitleColor(finalMood));

    try {
      const newQuote = await generateQuote(input);
      
      if (finalMood === 'Funny') {
        setIsFunnyAnimationActive(true);
        setTimeout(() => setIsFunnyAnimationActive(false), 4500);
      } else if (finalMood === 'Motivational') {
        setIsMotivationalAnimationActive(true);
        setTimeout(() => setIsMotivationalAnimationActive(false), 4500);
      } else { // For Love, Sad, Scientific, Default
        setIsFlowerAnimationActive(true);
        setTimeout(() => setIsFlowerAnimationActive(false), 6000);
      }
      setQuoteData(newQuote);

    } catch (e: any) {
      console.error(e);
      const errorMessage = e.message || "Failed to fetch a new quote.";
      let toastDescription = "Failed to fetch a new quote. Please try again.";

      if (typeof errorMessage === 'string' && (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota"))) {
        toastDescription = "Whoa there, easy on the clicks! Rate limit reached. Please try again in a little bit. 😄";
      }
      
      toast({
        title: "Error",
        description: toastDescription,
        variant: "destructive",
      });
      
      // Reset to default if error
      setBackgroundComponent(() => AscendBackground); 
      setIsGrayscale(false);
      setSubtitleColorClass(getSubtitleColor('Motivational'));
      setSelectedMood('Motivational');


    } finally {
      setIsLoading(false);
    }
  }, [toast, selectedMood, getSubtitleColor]);

  useEffect(() => {
    const loadInitialQuote = async () => {
      setIsLoading(true);
      setIsInitialLoading(true); 

      setBackgroundComponent(() => AscendBackground);
      setIsGrayscale(false);
      setSubtitleColorClass(getSubtitleColor('Motivational'));
      setSelectedMood('Motivational'); // Set initial mood for theme

      try {
        const newQuote = await generateQuote({ seed: Math.random(), mood: 'Motivational' });
        setQuoteData(newQuote);
        // Trigger motivational animation on initial load
        setIsMotivationalAnimationActive(true);
        setTimeout(() => setIsMotivationalAnimationActive(false), 4500);
      } catch (e) {
        console.error(e);
        let errorMessage = "Failed to fetch initial quote. Please try again.";
        if (e instanceof Error) {
          errorMessage = `Failed to fetch initial quote: ${e.message}`;
        }

        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        // Reset to default theme if initial load fails
        setBackgroundComponent(() => DefaultAnimatedBackground);
        setSubtitleColorClass(getSubtitleColor(null));
        setSelectedMood(null);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false); 
      }
    };
    loadInitialQuote();
  }, [toast, getSubtitleColor]); // Ensure getSubtitleColor is in dependencies

  const handleMoodSelect = (moodLabel: MoodLabel) => {
    setSelectedMood(moodLabel);
    // Determine new background and subtitle color based on moodLabel
    let newBgComponent: ComponentType<{isActive?: boolean}> | null = DefaultAnimatedBackground;
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
      newBgComponent = FunnyBackground;
    }

    setBackgroundComponent(() => newBgComponent);
    setIsGrayscale(grayscaleActive);
    setSubtitleColorClass(getSubtitleColor(moodLabel));
    // Do NOT fetch a new quote here. Theme is set, quote will be fetched by "New Quote" button.
  };

  if (isInitialLoading) {
    return (
      <>
        {BackgroundComponent && (
          <div className="fixed inset-0 z-[-1]">
            {/* @ts-ignore TODO: Fix isActive prop type for all BackgroundComponents */}
            <BackgroundComponent isActive={isMotivationalAnimationActive}/>
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

  const currentBgIsActive = 
    selectedMood === 'Funny' ? isFunnyAnimationActive : 
    selectedMood === 'Motivational' ? isMotivationalAnimationActive : 
    undefined;


  return (
    <>
      {BackgroundComponent && (
        <div className="fixed inset-0 z-[-1]">
          { /* @ts-ignore */ }
          <BackgroundComponent isActive={currentBgIsActive} />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col items-center justify-center min-h-screen p-4 text-center bg-transparent text-foreground relative",
          "transition-all duration-700 ease-in-out",
          isGrayscale ? 'grayscale-filter' : '',
          isShaking ? 'animate-screenShake' : '' // Apply screen shake conditionally
        )}
      >
        <WaterRippleEffect />
        {selectedMood !== 'Funny' && selectedMood !== 'Motivational' && <FlowerAnimation isActive={isFlowerAnimationActive} />}

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

