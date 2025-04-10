
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueStatus } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IssueCard from '@/components/IssueCard';
import { Plus, Search } from 'lucide-react';

const MyIssues: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userIssues, loading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Make sure the user is logged in and is a student
  if (!user || user.role !== 'student') {
    navigate('/login');
    return null;
  }

  // Filter issues based on search
  const filteredIssues = userIssues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group issues by status
  const pendingIssues = filteredIssues.filter(issue => issue.status === 'pending');
  const inProgressIssues = filteredIssues.filter(issue => issue.status === 'in-progress');
  const resolvedIssues = filteredIssues.filter(issue => issue.status === 'resolved');
  const rejectedIssues = filteredIssues.filter(issue => issue.status === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Issues</h1>
          <p className="text-gray-500">View and track all of your submitted issues</p>
        </div>
        <Button onClick={() => navigate('/new-issue')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Submit New Issue
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search issues..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredIssues.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingIssues.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressIssues.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedIssues.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedIssues.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No issues found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {pendingIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending issues found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {inProgressIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No issues in progress.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6">
          {resolvedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No resolved issues yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No rejected issues.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyIssues;
