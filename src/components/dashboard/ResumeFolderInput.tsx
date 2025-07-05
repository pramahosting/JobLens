import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  FolderOpen, Link2, CheckCircle, Undo2, Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

const ResumeFolderInput = () => {
  const [folderPath, setFolderPath] = useState('');
  const [cloudLink, setCloudLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('folder');
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const typedArray = new Uint8Array(reader.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            resolve(fullText);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer });
            resolve(result.value);
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
    return '';
  };

  const extractResumeDetails = async (text: string) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a resume screening assistant. Extract Name, Email (if any), Skills, Experience, Education from this resume in JSON format."
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      });

      const data = await response.json();
      const raw = data?.choices?.[0]?.message?.content || '{}';
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to process resume:', err);
      return null;
    }
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFolderPath(`${files.length} files selected`);
    setProgress(0);
    setResults([]);
    setIsCompleted(false);

    toast({
      title: 'Folder selected',
      description: `Found ${files.length} resume files`,
    });

    const total = files.length;
    const parsedResults = [];

    for (let i = 0; i < total; i++) {
      try {
        const text = await extractTextFromFile(files[i]);
        const parsed = await extractResumeDetails(text);
        if (parsed) {
          parsedResults.push({
            name: parsed.Name || `Candidate ${i + 1}`,
            email: parsed.Email || '',
            phone: parsed.Phone || '',
            skills: parsed.Skills || [],
            experience: parsed.Experience || '',
            education: parsed.Education || '',
          });
        }
      } catch (err) {
        console.warn(`Failed to parse file ${files[i].name}`);
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setResults(parsedResults);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setFolderPath('');
    setCloudLink('');
    setIsCompleted(false);
    setResults([]);
    setProgress(0);
  };

  const handleDownloadExcel = () => {
    const sheetData = results.map((r) => ({
      Name: r.name,
      Email: r.email,
      Phone: r.phone,
      Skills: Array.isArray(r.skills) ? r.skills.join(', ') : r.skills,
      Experience: r.experience,
      Education: r.education
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
    XLSX.writeFile(wb, `Resume_ExtractedResults.xlsx`);
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Resume Folder Input</CardTitle>
            <CardDescription>
              Upload a folder or paste a cloud storage link to resumes
            </CardDescription>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg mt-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{results.length} resumes processed</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 flex-grow overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="folder">Folder Upload</TabsTrigger>
            <TabsTrigger value="cloud">Cloud Folder Link</TabsTrigger>
          </TabsList>

          <TabsContent value="folder">
            <Label htmlFor="folder-input">Choose Folder</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Upload resume files (.pdf, .docx)</p>
              <div className="flex items-center justify-center space-x-3">
                <label htmlFor="folder-input">
                  <Button variant="outline">📁 Choose Files</Button>
                </label>
                <Input
                  id="folder-input"
                  type="file"
                  multiple
                  accept=".pdf,.docx"
                  onChange={handleFolderSelect}
                  className="hidden"
                />
                <span className="text-sm text-gray-700">{folderPath || 'No files chosen'}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cloud">
            <Label htmlFor="cloud-link">Paste Cloud Folder Link</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cloud-link"
                type="url"
                placeholder="https://drive.google.com/..."
                value={cloudLink}
                onChange={(e) => setCloudLink(e.target.value)}
                className="pl-10"
              />
            </div>
          </TabsContent>
        </Tabs>

        {progress > 0 && progress < 100 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Processing resumes...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {results.length > 0 && (
          <div className="overflow-auto mt-4">
            <table className="table-auto w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Skills</th>
                  <th className="px-4 py-2">Experience</th>
                  <th className="px-4 py-2">Education</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{r.name}</td>
                    <td className="px-4 py-2">{r.email}</td>
                    <td className="px-4 py-2">{r.phone}</td>
                    <td className="px-4 py-2">{Array.isArray(r.skills) ? r.skills.join(', ') : r.skills}</td>
                    <td className="px-4 py-2">{r.experience}</td>
                    <td className="px-4 py-2">{r.education}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end pt-4">
              <Button onClick={handleDownloadExcel} className="bg-blue-600 text-white hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="ghost" onClick={handleReset} className="text-red-500 hover:text-red-700">
            <Undo2 className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeFolderInput;
