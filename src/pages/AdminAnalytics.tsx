
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueCategory, IssueStatus } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issues, loading } = useData();
  
  // Make sure user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Calculate statistics by category
  const getCategoryStats = () => {
    const categoryCounts: Record<IssueCategory, number> = {
      academics: 0,
      hostel: 0,
      facilities: 0,
      extracurricular: 0,
      other: 0
    };
    
    issues.forEach(issue => {
      categoryCounts[issue.category]++;
    });
    
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ 
        category, 
        count,
        percentage: Math.round((count / issues.length) * 100) || 0
      }))
      .sort((a, b) => b.count - a.count);
  };
  
  // Calculate statistics by status
  const getStatusStats = () => {
    const statusCounts: Record<IssueStatus, number> = {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      rejected: 0
    };
    
    issues.forEach(issue => {
      statusCounts[issue.status]++;
    });
    
    return Object.entries(statusCounts)
      .map(([status, count]) => ({ 
        status, 
        count,
        percentage: Math.round((count / issues.length) * 100) || 0
      }));
  };
  
  // Calculate resolution time statistics (in days)
  const getResolutionTimeStats = () => {
    const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
    
    if (resolvedIssues.length === 0) {
      return { average: 0, min: 0, max: 0 };
    }
    
    const resolutionTimes = resolvedIssues.map(issue => {
      const createdDate = new Date(issue.createdAt).getTime();
      const resolvedDate = new Date(issue.updatedAt).getTime();
      return Math.round((resolvedDate - createdDate) / (1000 * 60 * 60 * 24)); // Convert to days
    });
    
    const average = Math.round(resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length);
    const min = Math.min(...resolutionTimes);
    const max = Math.max(...resolutionTimes);
    
    return { average, min, max };
  };
  
  const categoryStats = getCategoryStats();
  const statusStats = getStatusStats();
  const resolutionTimeStats = getResolutionTimeStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Campus Analytics</h1>
          <p className="text-gray-500">Insights on student issues and resolution metrics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{issues.length}</div>
            <p className="text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {Math.round((statusStats.find(s => s.status === 'resolved')?.count || 0) / issues.length * 100)}%
            </div>
            <p className="text-gray-500 mt-2">Issues resolved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg. Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{resolutionTimeStats.average}</div>
            <p className="text-gray-500 mt-2">Days to resolve</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map(({ category, count, percentage }) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{category}</span>
                      <span>{count} issues ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-campus-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusStats.map(({ status, count, percentage }) => (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize">{status.replace('-', ' ')}</span>
                      <span>{count} issues ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status === 'resolved' 
                            ? 'bg-green-500' 
                            : status === 'in-progress' 
                            ? 'bg-amber-500' 
                            : status === 'pending' 
                            ? 'bg-blue-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolution Time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{resolutionTimeStats.min}</div>
                  <div className="text-gray-500">Fastest (days)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{resolutionTimeStats.average}</div>
                  <div className="text-gray-500">Average (days)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{resolutionTimeStats.max}</div>
                  <div className="text-gray-500">Longest (days)</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-4">Time to Resolution</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="text-center text-gray-500">
                    Resolution time chart would appear here
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
