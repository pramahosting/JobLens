import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderOpen, Link, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ResumeFolderInput = () => {
  const [folderPath, setFolderPath] = useState('');
  const [cloudLink, setCloudLink] = useState('');
  const { toast } = useToast();

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFolderPath(`${files.length} files selected`);
      toast({
        title: 'Folder selected',
        description: `Found ${files.length} resume files.`,
      });
    } else {
      setFolderPath('');
    }
  };

  const handleCloudLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCloudLink(e.target.value);
  };

  const handleReset = () => {
    setFolderPath('');
    setCloudLink('');
    (document.getElementById('folder-input') as HTMLInputElement).value = '';
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Resume Input</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-2">Upload resumes via folder or cloud link</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-700">
            <Undo2 className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow overflow-auto">
  <Tabs defaultValue="folder" className="w-full">
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger value="folder">Folder Upload</TabsTrigger>
      <TabsTrigger value="cloud">Cloud Folder Link</TabsTrigger>
    </TabsList>

    {/* Folder Upload Tab */}
    <TabsContent value="folder">
      <div className="space-y-2">
        <Label htmlFor="folder-input">Choose Folder</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <FolderOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-4">
            Upload a folder containing resume files (.pdf, .docx)
          </p>
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
        </div>
        <div className="bg-purple-50 text-purple-800 text-sm p-2 mt-2 rounded-md">
          {folderPath || 'No folder chosen'}
        </div>
      </div>
    </TabsContent>

    {/* Cloud Folder Link Tab */}
    <TabsContent value="cloud">
      <div className="space-y-2">
        <Label htmlFor="cloud-link">Cloud Folder URL</Label>
        <Input
          id="cloud-link"
          type="url"
          placeholder="Enter a shared Google Drive, Dropbox, or OneDrive link"
          className="w-full"
        />
      </div>
    </TabsContent>
  </Tabs>
</CardContent>
          {/* Cloud Folder Tab */}
          <TabsContent value="cloud">
            <div className="space-y-2">
              <Label htmlFor="cloud-link">Enter cloud folder URL (Google Drive, Dropbox, etc.)</Label>
              <div className="flex space-x-2">
                <Input
                  id="cloud-link"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={cloudLink}
                  onChange={handleCloudLinkChange}
                />
                <Link className="text-gray-500 mt-2" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResumeFolderInput;
