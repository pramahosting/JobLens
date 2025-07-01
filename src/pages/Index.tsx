import React, { useState } from 'react';
import JobDescriptionInput from './JobDescriptionInput';
import ResumeFolderInput from './ResumeFolderInput';
import { Button } from '@/components/ui/button';
import { Download, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ResultTable from './ResultTable';

const IndexPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleRunAgent = () => {
    setIsProcessing(true);
    // Simulate processing and mock results
    setTimeout(() => {
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
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid lg:grid-cols-2 gap-8 mb-2">
        <div className="h-[600px]">
          <JobDescriptionInput />
        </div>
        <div className="h-[600px]">
          <ResumeFolderInput />
        </div>
      </div>

      <div className="flex justify-center -mt-4">
        <Button
          onClick={handleRunAgent}
          disabled={isProcessing}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Run Agent'}
        </Button>
      </div>

      <div className="mt-6">
        <ResultTable results={results} />
      </div>
    </div>
  );
};

export default IndexPage;
