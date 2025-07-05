import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Link2, CheckCircle, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const JobDescriptionInput = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setJobDescription(text);
    };
    reader.readAsText(file);
    setSelectedFile(file);
    toast({ title: 'File selected', description: file.name });
  };

  const handleProcessDescription = async () => {
    if (!jobDescription.trim()) {
      toast({ title: 'Error', description: 'Please enter a job description.', variant: 'destructive' });
      return;
    }

    try {
      setIsProcessed(false);
      setExtractedInfo(null);
      setErrorMessage(null);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'JobIntel GPT',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that extracts structured job information in a readable summary with bullet points under categories like Job Title, Key Skills, Experience, Tools, Responsibilities, etc.',
            },
            {
              role: 'user',
              content: `Extract Job Title, Key Skills, Responsibilities, Experience, Tools, Qualifications, and Soft Skills from the following JD:\n\n${jobDescription}`,
            },
          ],
        }),
      });

      const result = await response.json();
      const content = result?.choices?.[0]?.message?.content;

      if (content) {
        setExtractedInfo(content);
        setIsProcessed(true);
      } else {
        throw new Error('No content returned from OpenRouter.');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      toast({ title: 'Processing failed', description: error.message, variant: 'destructive' });
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setSelectedFile(null);
    setIsProcessed(false);
    setExtractedInfo(null);
    setErrorMessage(null);
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Job Description Input</CardTitle>
            <CardDescription>Provide job details via text or file upload</CardDescription>
          </div>
        </div>
        {isProcessed && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg mt-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Job description processed successfully</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6 flex-grow overflow-auto">
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Direct Text</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste your job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Job Description</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">Upload a .txt, .pdf, or .docx file</p>
                <Input id="file-upload" type="file" accept=".txt,.pdf,.docx" onChange={handleFileChange} />
              </div>
              {selectedFile && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
          <Button onClick={handleProcessDescription} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Process Description
          </Button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded mt-4 text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {extractedInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Extracted Job Information:</h4>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{extractedInfo}</pre>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="ghost" onClick={handleReset} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
            <Undo2 className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;

