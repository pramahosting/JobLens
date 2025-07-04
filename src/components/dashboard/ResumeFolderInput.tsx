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

const ResumeFolderInput = () => {
  const [folderPath, setFolderPath] = useState('');
  const [cloudLink, setCloudLink] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('folder');
  const { toast } = useToast();

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFolderPath(`${files.length} files selected`);
      toast({
        title: 'Folder selected',
        description: `Found ${files.length} resume files`,
      });

      // Simulate processing and populate results (replace with real logic)
      setTimeout(() => {
        const dummyResults = Array.from({ length: files.length }).map((_, i) => ({
          name: `Candidate ${i + 1}`,
          email: `candidate${i + 1}@email.com`,
          phone: `040000000${i}`,
          atsScore: 70 + i % 20,
          status: i % 3 === 0 ? 'qualified' : 'review',
          strengths: ['React', 'Node.js'],
          gaps: ['AWS', 'Docker']
        }));
        setResults(dummyResults);
        setIsCompleted(true);
        setProgress(100);
      }, 1000);
    }
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
      ATSScore: r.atsScore,
      Status: r.status,
      Strengths: r.strengths.join(', '),
      Gaps: r.gaps.join(', ')
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');

    const fileName = folderPath.split(' ')[0] || 'ResumeResults';
    XLSX.writeFile(wb, `${fileName}_ExtractedResults.xlsx`);
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
            <span className="text-sm font-medium">{results.length} resumes processed successfully</span>
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
            <div className="space-y-2">
              <Label htmlFor="folder-input">Choose Folder</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  Upload a folder containing resume files (.pdf, .docx)
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative inline-block">
                    <label htmlFor="folder-input">
                      <Button variant="outline" className="text-sm">
                        📁 Choose Folder
                      </Button>
                    </label>
                    <Input
                      id="folder-input"
                      type="file"
                      multiple
                      accept=".pdf,.docx"
                      webkitdirectory="true"
                      directory=""
                      onChange={handleFolderSelect}
                      className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-700">
                    {folderPath || 'No folder chosen'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cloud">
            <div className="space-y-2">
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
            </div>
          </TabsContent>
        </Tabs>

        {progress > 0 && progress < 100 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Processing resumes...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleDownloadExcel}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-red-500 hover:text-red-700"
          >
            <Undo2 className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeFolderInput;

