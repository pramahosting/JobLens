// src/utils/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use .env file to store your key
  dangerouslyAllowBrowser: true, // Only for front-end testing. Don't use in production!
});

export const extractJobInfo = async (text: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that extracts structured information from job descriptions.'
      },
      {
        role: 'user',
        content: `Extract key details (Job Title, Key Skills, Experience, Education) from the following JD:\n\n${text}`
      }
    ],
    temperature: 0.3
  });

  return response.choices[0]?.message?.content;
};
