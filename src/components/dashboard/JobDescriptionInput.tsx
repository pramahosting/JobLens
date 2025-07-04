import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Link2, CheckCircle, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

const JobDescriptionInput = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF or DOCX',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async () => {
          const typedArray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          setJobDescription(fullText);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
          setJobDescription(result.value);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      toast({
        title: 'File processing failed',
        description: 'Unable to extract text from file',
        variant: 'destructive',
      });
    }
  };

  const handleProcessDescription = async () => {
    if (!jobDescription || jobDescription.trim() === '') {
      setErrorMessage("Please enter a job description.");
      return;
    }

    setErrorMessage(null);
    setIsProcessed(false);
    setExtractedInfo(null);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that extracts structured job information like Job Title, Key Skills, Experience, and Education."
            },
            {
              role: "user",
              content: `Extract Job Title, Key Skills, Experience, and Education from the following JD:\n\n${jobDescription}`
            }
          ]
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        setExtractedInfo(data.choices[0].message.content);
        setIsProcessed(true);
      } else {
        throw new Error("No response content from model.");
      }
    } catch (error: any) {
      const msg = error?.message || "Unknown error occurred";
      setErrorMessage(msg);
      toast({
        title: "Failed to process JD",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded p-1" />
          <div>
            <CardTitle className="text-xl">Job Description Input</CardTitle>
            <CardDescription>Provide job details via text or file</CardDescription>
          </div>
        </div>
        {isProcessed && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg mt-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Processed successfully</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Direct Text</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Label>Job Description</Label>
            <Textarea
              placeholder="Paste your job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <Label>Upload JD File (.pdf or .docx)</Label>
            <Input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
            {selectedFile && (
              <p className="text-sm text-blue-800">Selected: {selectedFile.name}</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleProcessDescription} className="bg-blue-600 text-white hover:bg-blue-700">
            Process Description
          </Button>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}

        {extractedInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Extracted Job Information:</h4>
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{extractedInfo}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;
