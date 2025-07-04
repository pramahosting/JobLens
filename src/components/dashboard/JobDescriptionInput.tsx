import React, { useState } from 'react';
import mammoth from 'mammoth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Link2, CheckCircle, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import OpenAI from 'openai';

// API key and openai client setup as before
const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });

const JobDescriptionInput = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const { toast } = useToast();

  // Updated file change handler - extract DOCX text with mammoth
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF or DOCX file',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);

      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // DOCX extraction
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result;
          if (arrayBuffer) {
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer as ArrayBuffer });
              setJobDescription(result.value);
              setActiveTab('text'); // switch to text tab to show extracted content
              toast({
                title: 'File processed',
                description: `Extracted text from ${file.name}`,
              });
            } catch (error) {
              toast({
                title: 'Extraction failed',
                description: 'Could not extract text from DOCX file',
                variant: 'destructive',
              });
            }
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/pdf') {
        // For now: reject PDFs or show a warning
        toast({
          title: 'PDF support',
          description: 'PDF extraction not yet implemented',
          variant: 'warning',
        });
        // You can add PDF extraction later using pdfjs-dist if needed
      }
    }
  };

  const handleReset = () => {
    setJobDescription('');
    setFileUrl('');
    setSelectedFile(null);
    setIsProcessed(false);
    setExtractedInfo(null);
    setErrorMessage(null);
  };

  const handleProcessDescription = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter a job description or upload a valid file.',
        variant: 'destructive',
      });
      return;
    }

    setErrorMessage(null);
    setIsProcessed(false);
    setExtractedInfo(null);

    try {
      // Example OpenRouter API call - replace with your endpoint and model
      const res = await openai.chat.completions.create({
        model: 'openrouter/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that extracts structured job information.',
          },
          {
            role: 'user',
            content: `Extract Job Title, Key Skills, Experience, and Education from the following JD:\n\n${jobDescription}`,
          },
        ],
        temperature: 0.3,
      });

      const content = res.choices?.[0]?.message?.content;
      if (content) {
        setExtractedInfo(content);
        setIsProcessed(true);
      } else {
        throw new Error('No content returned from API.');
      }
    } catch (err: any) {
      const message = err?.message || 'Unknown error occurred';
      setErrorMessage(message);
      toast({
        title: 'Failed to process JD',
        description: message,
        variant: 'destructive',
      });
    }
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
            <CardDescription>Provide job details via text, file upload, or URL</CardDescription>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Direct Text</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">Drop your file here or click to browse</p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
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

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-url">File URL</Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="file-url"
                  type="url"
                  placeholder="https://example.com/job-description.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleProcessDescription}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
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
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-red-500 hover:text-red-700 flex items-center space-x-1"
          >
            <Undo2 className="w-4 h-4" />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInput;


