
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import IssueCard from '@/components/IssueCard';
import { FileText, AlertCircle, CheckCircle, PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issues, userIssues, loading } = useData();
  
  // Filter user's issues if student is logged in
  const studentIssues = user?.role === 'student' ? userIssues : [];
  
  // Calculate statistics for student
  const pendingCount = studentIssues.filter(issue => issue.status === 'pending').length;
  const inProgressCount = studentIssues.filter(issue => issue.status === 'in-progress').length;
  const resolvedCount = studentIssues.filter(issue => issue.status === 'resolved').length;
  
  // Get recent issues
  const recentIssues = [...studentIssues].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => navigate('/new-issue')} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Submit New Issue
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pending Issues" 
          value={pendingCount}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="In Progress" 
          value={inProgressCount}
          icon={<FileText className="h-6 w-6" />}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          title="Resolved Issues" 
          value={resolvedCount}
          icon={<CheckCircle className="h-6 w-6" />}
          color="bg-green-50 text-green-600"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription>Your most recently submitted issues</CardDescription>
        </CardHeader>
        <CardContent>
          {recentIssues.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recentIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium">No issues yet</h3>
              <p className="text-gray-500 mt-2">
                You haven't submitted any issues or suggestions yet.
              </p>
              <Button 
                onClick={() => navigate('/new-issue')} 
                variant="outline" 
                className="mt-4"
              >
                Submit Your First Issue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
