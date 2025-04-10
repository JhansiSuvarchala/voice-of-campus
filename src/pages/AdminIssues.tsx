
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueStatus, IssueCategory, IssuePriority } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IssueCard from '@/components/IssueCard';
import { Search, Filter, ListFilter } from 'lucide-react';

const statusOptions: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' }
];

const categoryOptions: { value: IssueCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'academics', label: 'Academics' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'extracurricular', label: 'Extracurricular' },
  { value: 'other', label: 'Other' }
];

const priorityOptions: { value: IssuePriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const AdminIssues: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issues, loading } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Make sure user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filter issues based on search and filters
  const filteredIssues = issues.filter(issue => {
    // Text search
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.studentName && issue.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Group issues by status for tabs
  const pendingIssues = filteredIssues.filter(issue => issue.status === 'pending');
  const inProgressIssues = filteredIssues.filter(issue => issue.status === 'in-progress');
  const resolvedIssues = filteredIssues.filter(issue => issue.status === 'resolved');
  const rejectedIssues = filteredIssues.filter(issue => issue.status === 'rejected');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-campus-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Issues</h1>
        <p className="text-gray-500">View and manage all campus issues</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search issues by title, description, or student name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as IssueStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select 
                value={categoryFilter} 
                onValueChange={(value) => setCategoryFilter(value as IssueCategory | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select 
                value={priorityFilter} 
                onValueChange={(value) => setPriorityFilter(value as IssuePriority | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All Issues ({filteredIssues.length})
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
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <ListFilter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No matching issues found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {pendingIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending issues found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {inProgressIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No issues in progress found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-6">
          {resolvedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No resolved issues found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} isAdmin={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No rejected issues found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminIssues;
