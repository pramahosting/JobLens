
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeFolderInput = () => {
  const [folderPath, setFolderPath] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFolderPath(`${files.length} files selected`);
      toast({
        title: "Folder selected",
        description: `Found ${files.length} resume files`,
      });
    }
  };

  const simulateProcessing = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          setIsProcessing(false);
          
          // Mock results
          setResults([
            {
              name: "John Smith",
              email: "john.smith@email.com",
              phone: "+1-555-0123",
              atsScore: 92,
              strengths: ["React", "Node.js", "AWS", "Leadership"],
              gaps: ["Python", "Machine Learning"],
              status: "qualified"
            },
            {
              name: "Sarah Johnson",
              email: "sarah.j@email.com", 
              phone: "+1-555-0124",
              atsScore: 88,
              strengths: ["JavaScript", "TypeScript", "React", "Database Design"],
              gaps: ["DevOps", "Microservices"],
              status: "qualified"
            },
            {
              name: "Mike Davis",
              email: "mike.davis@email.com",
              phone: "+1-555-0125", 
              atsScore: 65,
              strengths: ["HTML", "CSS", "Basic JavaScript"],
              gaps: ["React", "Backend Development", "Cloud Platforms"],
              status: "review"
            }
          ]);
          
          toast({
            title: "Processing complete",
            description: "All resumes have been analyzed successfully",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleProcess = () => {
    if (!folderPath) {
      toast({
        title: "Error",
        description: "Please select a folder with resume files",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setIsCompleted(false);
    setResults([]);
    simulateProcessing();
  };

  const handleReset = () => {
    setFolderPath('');
    setProgress(0);
    setResults([]);
    setIsCompleted(false);
    setIsProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'text-green-600 bg-green-50';
      case 'review': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="h-fit border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Resume Folder Input</CardTitle>
            <CardDescription>
              Select a folder containing multiple resume files
            </CardDescription>
          </div>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{results.length} resumes processed successfully</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="folder-input">Select Resume Folder</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              Select a folder containing PDF or DOCX resume files
            </p>
            <Input
              id="folder-input"
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFolderSelect}
              className="max-w-xs mx-auto"
            />
          </div>
          {folderPath && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Selected:</strong> {folderPath}
              </p>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Processing resumes...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="flex space-x-3">
          <Button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Processing Resumes...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Process with AI
              </>
            )}
          </Button>
          
          {(isCompleted || folderPath) && (
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-purple-200 hover:bg-purple-50"
            >
              Reset
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Processing Results</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {results.length} candidates
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((candidate, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-gray-900">{candidate.name}</h5>
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                      <p className="text-sm text-gray-600">{candidate.phone}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(candidate.atsScore)}`}>
                        {candidate.atsScore}%
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(candidate.status)}`}>
                        {candidate.status === 'qualified' ? 'Qualified' : 'Needs Review'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-green-700 mb-1">Strengths:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.strengths.map((strength: string, i: number) => (
                          <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700 mb-1">Gaps:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.gaps.map((gap: string, i: number) => (
                          <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeFolderInput;
