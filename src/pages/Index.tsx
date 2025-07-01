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
  const [showResults, setShowResults] = useState(true); // ✅ Show results by default
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
    setTimeout(() => setShowResults(true), 1000);
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
            description: `${candidate.name} has been shortlisted.`,
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
        description: `Invitation sent to ${candidate.name}`,
      });
    }
  };

  const handleRunAgent = () => {
    toast({
      title: "AI Processing Started",
      description: "Job description and resumes are being processed",
    });
  };

  const features = [
    {
      icon: <Video className="h-8 w-8 text-green-600" />,
      title: "AI Video Interviews",
      description: "Automated video interviews with AI avatars"
    },
    {
      icon: <Mail className="h-8 w-8 text-orange-600" />,
      title: "Smart Communication",
      description: "Automated candidate communication and follow-ups"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
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
              <p className="text-xs text-gray-600 -mt-1">ai-powered recruitment intelligence</p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="space-x-2">
              <Button variant="ghost" onClick={handleLogin}>Login</Button>
              <Button onClick={handleSignup} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Sign Up</Button>
            </div>
          )}

          {isAuthenticated && (
            <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="border-purple-200 hover:bg-purple-50">Logout</Button>
          )}
        </div>
      </header>

      {/* Main */}
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
                <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Login</Button>
                <Button onClick={handleSignup} variant="outline" className="w-full border-purple-200 hover:bg-purple-50">Create Account</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {isAuthenticated && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-4">
              <div className="h-[600px]"><JobDescriptionInput /></div>
              <div className="h-[600px]"><ResumeFolderInput /></div>
            </div>

            {/* Run Agent Button */}
            <div className="text-center mb-8">
              <Button 
                size="lg" 
                onClick={handleRunAgent}
                className="px-6 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
              >
                <Brain className="w-5 h-5 mr-2" />
                Run Agent
              </Button>
            </div>
          </>
        )}

        {/* Results Table */}
        {isAuthenticated && showResults && (
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Results</CardTitle>
                    <CardDescription>Candidate analysis and ATS scoring results</CardDescription>
                  </div>
                  <Button onClick={handleExcelDownload} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" /> Download Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>ATS Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Video Interview</TableHead>
                      <TableHead>Analysis</TableHead>
                      <TableHead>Communication</TableHead>
                      <TableHead>Shortlist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.email}</TableCell>
                        <TableCell>{candidate.phone}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${
                            candidate.atsScore >= 85 ? 'text-green-600' : 
                            candidate.atsScore >= 70 ? 'text-yellow-600' : 
                            candidate.atsScore >= 20 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {candidate.atsScore}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            candidate.status === 'Qualified' ? 'bg-green-100 text-green-800' : 
                            candidate.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {candidate.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {candidate.videoInterviewStatus === 'Completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {candidate.videoInterviewStatus === 'Pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                            {candidate.videoInterviewStatus === 'Scheduled' && <Video className="h-4 w-4 text-blue-600" />}
                            <span className="text-sm">{candidate.videoInterviewStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{candidate.videoAnalysis}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {candidate.interviewEmailSent ? (
                              <div className="flex items-center text-green-600">
                                <Send className="h-4 w-4 mr-1" /><span className="text-xs">Sent</span>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => sendInterviewEmail(candidate)}
                                disabled={candidate.atsScore < 20}
                                className="text-xs"
                              >
                                Send Invite
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={candidate.shortlisted}
                            onCheckedChange={(checked) => handleShortlist(candidate.id, checked as boolean)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features */}
        {isAuthenticated && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Auth Modal */}
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
