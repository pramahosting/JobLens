
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthModal from '@/components/auth/AuthModal';
import JobDescriptionInput from '@/components/dashboard/JobDescriptionInput';
import ResumeFolderInput from '@/components/dashboard/ResumeFolderInput';
import { Brain, Users, Video, Mail, BarChart3 } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI Resume Parsing",
      description: "Advanced LLM-powered resume analysis and data extraction"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "ATS Scoring",
      description: "Intelligent candidate ranking with semantic matching"
    },
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              JobLens Agent
            </h1>
          </div>
          
          {!isAuthenticated && (
            <div className="space-x-2">
              <Button variant="ghost" onClick={handleLogin}>
                Login
              </Button>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        {/* Blurred overlay when not authenticated */}
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
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Login
                </Button>
                <Button 
                  onClick={handleSignup} 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Recruitment Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Automate your entire hiring process with advanced AI agents for resume parsing, 
            ATS scoring, video interviews, and candidate communication.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard */}
        {isAuthenticated && (
          <div className="grid lg:grid-cols-2 gap-8">
            <JobDescriptionInput />
            <ResumeFolderInput />
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
