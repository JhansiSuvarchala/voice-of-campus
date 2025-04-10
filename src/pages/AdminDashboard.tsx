
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import IssueCard from '@/components/IssueCard';
import { FileText, AlertCircle, CheckCircle, Clock, XCircle, BarChart2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issues, loading } = useData();
  
  // Make sure the user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Calculate statistics
  const pendingCount = issues.filter(issue => issue.status === 'pending').length;
  const inProgressCount = issues.filter(issue => issue.status === 'in-progress').length;
  const resolvedCount = issues.filter(issue => issue.status === 'resolved').length;
  const rejectedCount = issues.filter(issue => issue.status === 'rejected').length;
  const totalCount = issues.length;
  
  // Get recent issues for each category
  const recentPendingIssues = [...issues]
    .filter(issue => issue.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const recentInProgressIssues = [...issues]
    .filter(issue => issue.status === 'in-progress')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
    
  const recentResolvedIssues = [...issues]
    .filter(issue => issue.status === 'resolved')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of all campus issues and their statuses</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Total Issues" 
          value={totalCount}
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard 
          title="Pending" 
          value={pendingCount}
          change={`${Math.round((pendingCount / totalCount) * 100)}% of total`}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="In Progress" 
          value={inProgressCount}
          change={`${Math.round((inProgressCount / totalCount) * 100)}% of total`}
          icon={<Clock className="h-6 w-6" />}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          title="Resolved" 
          value={resolvedCount}
          change={`${Math.round((resolvedCount / totalCount) * 100)}% of total`}
          icon={<CheckCircle className="h-6 w-6" />}
          color="bg-green-50 text-green-600"
        />
        <StatCard 
          title="Rejected" 
          value={rejectedCount}
          change={`${Math.round((rejectedCount / totalCount) * 100)}% of total`}
          icon={<XCircle className="h-6 w-6" />}
          color="bg-red-50 text-red-600"
        />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Issue Distribution</CardTitle>
              <CardDescription>Breakdown of issues by category</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/analytics')}>
              <BarChart2 className="h-4 w-4 mr-2" />
              View Full Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center text-gray-500">
              Analytics visualization would appear here
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Issues ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Recently Resolved ({resolvedCount})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {recentPendingIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPendingIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending issues at this time.</p>
            </div>
          )}
          {pendingCount > 3 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/issues')}
              >
                View All Pending Issues
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {recentInProgressIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentInProgressIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No issues currently in progress.</p>
            </div>
          )}
          {inProgressCount > 3 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/issues')}
              >
                View All In-Progress Issues
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6">
          {recentResolvedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentResolvedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No recently resolved issues.</p>
            </div>
          )}
          {resolvedCount > 3 && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/resolved')}
              >
                View All Resolved Issues
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
