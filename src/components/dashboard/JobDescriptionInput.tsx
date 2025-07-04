import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Link2, CheckCircle, Undo2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// Get Hugging Face API key from environment variable
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

// Hugging Face GPT-2 model inference endpoint (can replace with another model)
const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2";

const JobDescriptionInput = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        toast({ title: 'File selected', description: `Selected: ${file.name}` });
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please select a PDF or DOCX file',
          variant: 'destructive',
        });
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
      toast({ title: 'Input required', description: 'Please enter a job description', variant: 'destructive' });
      return;
    }
    setErrorMessage(null);
    setIsProcessed(false);
    setExtractedInfo(null);

    try {
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Extract Job Title, Key Skills, Experience, and Education from the following JD:\n\n${jobDescription}`,
          parameters: { max_length: 512, temperature: 0.3 },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch from Hugging Face API");
      }

      const data = await response.json();

      // The output structure depends on the model, GPT2 returns generated text in data[0].generated_text
      if (Array.isArray(data) && data[0]?.generated_text) {
        setExtractedInfo(data[0].generated_text);
        setIsProcessed(true);
      } else if (typeof data.generated_text === 'string') {
        setExtractedInfo(data.generated_text);
        setIsProcessed(true);
      } else {
        throw new Error("Unexpected response format from Hugging Face API");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unknown error occurred');
      toast({
        title: 'Failed to process JD',
        description: err.message || 'API call failed',
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


