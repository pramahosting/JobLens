import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import AuthModal from '@/components/auth/AuthModal';
import JobDescriptionInput from '@/components/dashboard/JobDescriptionInput';
import ResumeFolderInput from '@/components/dashboard/ResumeFolderInput';
import { Users, Video, Mail, Download, CheckCircle, Clock, Send, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showResults, setShowResults] = useState(true); // Always show sample results by default
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const [results, setResults] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      atsScore: 92,
      status: "Qualified",
      videoInterviewStatus: "Completed",
      videoAnalysis: "Confident, Clear Communication",
      interviewEmailSent: true,
      shortlisted: false,
      staffName: "",
      staffEmail: ""
    },
    {
      id: 2,
      name: "Sarah Johnson", 
      email: "sarah.j@email.com",
      phone: "+1-555-0124",
      atsScore: 88,
      status: "Qualified",
      videoInterviewStatus: "Pending",
      videoAnalysis: "Awaiting Interview",
      interviewEmailSent: true,
      shortlisted: false,
      staffName: "",
      staffEmail: ""
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@email.com", 
      phone: "+1-555-0125",
      atsScore: 65,
      status: "Review",
      videoInterviewStatus: "Scheduled",
      videoAnalysis: "Interview Scheduled",
      interviewEmailSent: true,
      shortlisted: false,
      staffName: "",
      staffEmail: ""
    },
    {
      id: 4,
      name: "Lisa Brown",
      email: "lisa.brown@email.com",
      phone: "+1-555-0126",
      atsScore: 15,
      status: "Not Qualified",
      videoInterviewStatus: "Not Invited",
      videoAnalysis: "Below Threshold",
      interviewEmailSent: false,
      shortlisted: false,
      staffName: "",
      staffEmail: ""
    }
  ]);

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setShowResults(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleExcelDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Phone,ATS Score,Status,Video Status,Analysis,Shortlisted\n"
      + results.map(r => `${r.name},${r.email},${r.phone},${r.atsScore}%,${r.status},${r.videoInterviewStatus},${r.videoAnalysis},${r.shortlisted ? 'Yes' : 'No'}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "candidates_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShortlist = (candidateId: number, checked: boolean) => {
    setResults(prev => prev.map(candidate => {
      if (candidate.id === candidateId) {
        const updated = { ...candidate, shortlisted: checked };
        if (checked) {
          toast({
            title: "Candidate Shortlisted",
            description: `${candidate.name} has been shortlisted. Staff will be notified to schedule next round.`,
          });
        }
        return updated;
      }
      return candidate;
    }));
  };

  const sendInterviewEmail = (candidate: any) => {
    if (candidate.atsScore >= 20) {
      toast({
        title: "Interview Email Sent",
        description: `Video interview invitation sent to ${candidate.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                JobLens Agent
              </h1>
              <p className="text-xs text-gray-600 -mt-1">
                ai-powered recruitment intelligence
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="space-x-2">
              <Button variant="ghost" onClick={handleLogin}>Login</Button>
              <Button onClick={handleSignup} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Sign Up
              </Button>
            </div>
          )}

          {isAuthenticated && (
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
              className="border-purple-200 hover:bg-purple-50"
            >
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative">
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <Card className="max-w-md w-full mx-4 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome to JobLens Agent
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Please sign in to access the AI recruitment platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Login
                </Button>
                <Button onClick={handleSignup} variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-4">
              <div className="h-[400px]">
                <JobDescriptionInput />
              </div>
              <div className="h-[400px]">
                <ResumeFolderInput />
              </div>
            </div>

            <div className="text-center mb-10">
              <Button
                onClick={simulateProcessing}
                disabled={isProcessing}
                size="lg"
                className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg text-white"
              >
                <Brain className="w-5 h-5 mr-2" />
                {isProcessing ? 'Processing...' : 'Run Agent'}
              </Button>
            </div>

            {showResults && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-purple-700">Sample Candidate Results</h2>
                  <Button onClick={handleExcelDownload} className="bg-white border text-blue-600 border-blue-400 hover:bg-blue-50">
                    <Download className="w-4 h-4 mr-2" /> Download CSV
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-100">
                      <TableHead className="text-purple-900">Shortlist</TableHead>
                      <TableHead className="text-purple-900">Name</TableHead>
                      <TableHead className="text-purple-900">Email</TableHead>
                      <TableHead className="text-purple-900">Phone</TableHead>
                      <TableHead className="text-purple-900">ATS Score</TableHead>
                      <TableHead className="text-purple-900">Status</TableHead>
                      <TableHead className="text-purple-900">Video Interview</TableHead>
                      <TableHead className="text-purple-900">Analysis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => (
                      <TableRow key={r.id} className="bg-white even:bg-slate-50">
                        <TableCell>
                          <Checkbox checked={r.shortlisted} onCheckedChange={(checked: boolean) => handleShortlist(r.id, checked)} />
                        </TableCell>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell className="text-center font-semibold text-blue-600">{r.atsScore}%</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>{r.videoInterviewStatus}</TableCell>
                        <TableCell>{r.videoAnalysis}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
