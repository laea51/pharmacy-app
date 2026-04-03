'use server';
/**
 * @fileOverview A Genkit flow for extracting medication details from a slip.
 *
 * - extractMedicationDetailsFromSlip - A function that handles the extraction of medication details.
 * - ExtractMedicationDetailsFromSlipInput - The input type for the extractMedicationDetailsFromSlip function.
 * - ExtractMedicationDetailsFromSlipOutput - The return type for the extractMedicationDetailsFromSlip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationDetailSchema = z.object({
  name: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication (e.g., "500mg", "2.5ml", "once daily").'),
  quantity: z.string().describe('The quantity of the medication (e.g., "30 pills", "1 bottle", "1 unit").'),
});

const ExtractMedicationDetailsFromSlipInputSchema = z.object({
  slipImageUri: z.string().optional().describe(
    "Optional: A photo of the medication slip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  slipText: z.string().optional().describe(
    "Optional: Text content from the medication slip, if available as text."
  ),
}).refine(data => data.slipImageUri || data.slipText, {
  message: "Either slipImageUri or slipText must be provided.",
});
export type ExtractMedicationDetailsFromSlipInput = z.infer<typeof ExtractMedicationDetailsFromSlipInputSchema>;

const ExtractMedicationDetailsFromSlipOutputSchema = z.array(MedicationDetailSchema).describe(
  "An array of identified medications, each with its name, dosage, and quantity."
);
export type ExtractMedicationDetailsFromSlipOutput = z.infer<typeof ExtractMedicationDetailsFromSlipOutputSchema>;

export async function extractMedicationDetailsFromSlip(input: ExtractMedicationDetailsFromSlipInput): Promise<ExtractMedicationDetailsFromSlipOutput> {
  return extractMedicationDetailsFromSlipFlow(input);
}

const extractMedicationDetailsPrompt = ai.definePrompt({
  name: 'extractMedicationDetailsPrompt',
  input: {schema: ExtractMedicationDetailsFromSlipInputSchema},
  output: {schema: ExtractMedicationDetailsFromSlipOutputSchema},
  prompt: `You are an AI assistant specialized in extracting medication details from prescription slips.
Your task is to identify and list each medication found on the slip, along with its specified dosage and quantity.
Focus only on medication details; ignore patient information, doctor's notes, or pharmacy details.

If an image is provided, prioritize extracting information from the image. If only text is provided, use the text.
If both are provided, use the image as the primary source and supplement with text if needed.

Input:
{{#if slipImageUri}}
  Image of Medication Slip: {{media url=slipImageUri}}
{{/if}}

{{#if slipText}}
  Text from Medication Slip:
  \`\`\`
  {{{slipText}}}
  \`\`\`
{{/if}}

Please extract the medication details in the following JSON format:
{{jsonSchema output.schema}}`,
});

const extractMedicationDetailsFromSlipFlow = ai.defineFlow(
  {
    name: 'extractMedicationDetailsFromSlipFlow',
    inputSchema: ExtractMedicationDetailsFromSlipInputSchema,
    outputSchema: ExtractMedicationDetailsFromSlipOutputSchema,
  },
  async (input) => {
    const {output} = await extractMedicationDetailsPrompt(input);
    return output!;
  }
);
