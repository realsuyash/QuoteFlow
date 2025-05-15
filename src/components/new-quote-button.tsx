
"use client";

import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface NewQuoteButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function NewQuoteButton({ onClick, isLoading }: NewQuoteButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={isLoading} 
      size="lg"
      className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-all duration-150 ease-in-out hover:shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={isLoading ? "Generating new quote" : "Get a new quote"}
      aria-live="polite"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-5 w-5" />
      )}
      {isLoading ? 'Generating...' : 'New Quote'}
    </Button>
  );
}
