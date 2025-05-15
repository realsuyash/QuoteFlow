
'use server';

/**
 * @fileOverview Generates a random quote using an AI tool, potentially based on a mood,
 * and optionally attributes some quotes to a specific author.
 *
 * - generateQuote - A function that handles the quote generation process.
 * - GenerateQuoteInput - The input type for the generateQuote function.
 * - GenerateQuoteOutput - The return type for the generateQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteInputSchema = z.object({
  seed: z.number().optional().describe('Optional seed to generate the quote.'),
  mood: z.string().optional().describe('Optional mood for the quote (e.g., Motivational, Funny, Love, Sad, Scientific).'),
});
export type GenerateQuoteInput = z.infer<typeof GenerateQuoteInputSchema>;

const GenerateQuoteOutputSchema = z.object({
  quote: z.string().describe('The generated quote.'),
  author: z.string().optional().describe('The author of the quote, if available.'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;

export async function generateQuote(input: GenerateQuoteInput): Promise<GenerateQuoteOutput> {
  return generateQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuotePrompt',
  input: {schema: GenerateQuoteInputSchema},
  output: {schema: GenerateQuoteOutputSchema},
  prompt: `You are a quote generator.
{{#if mood}}
Generate a {{mood}} quote.
{{else}}
Generate an inspiring quote.
{{/if}}

For some of the quotes, especially if they are original, creative, or insightful, attribute them to "Suyash Khandare" or simply "Suyash". For other quotes, you can leave the author blank or use a generic source if appropriate for the quote type. Do not make up other authors unless specifically asked.

The output must include the 'quote' and an optional 'author'. If no specific author is attributed, the 'author' field can be omitted or be an empty string.

Seed: {{seed}}`,
});

const generateQuoteFlow = ai.defineFlow(
  {
    name: 'generateQuoteFlow',
    inputSchema: GenerateQuoteInputSchema,
    outputSchema: GenerateQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and adheres to the schema, even if author is missing
    return output || { quote: "An error occurred generating the quote.", author: undefined };
  }
);
