
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueStatus, IssuePriority } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import IssueStatusBadge from '@/components/IssueStatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import PriorityBadge from '@/components/PriorityBadge';
import IssueComments from '@/components/IssueComments';
import { ChevronLeft, User, Mail, Flag, Check } from 'lucide-react';

const statusOptions: { value: IssueStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' }
];

const priorityOptions: { value: IssuePriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const AdminIssueDetail: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getIssueById, updateIssueStatus, updateIssuePriority, assignIssue } = useData();
  
  const issue = getIssueById(issueId || '');
  
  const [status, setStatus] = useState<IssueStatus | undefined>(issue?.status);
  const [priority, setPriority] = useState<IssuePriority | undefined>(issue?.priority);
  const [isSaving, setIsSaving] = useState(false);
  
  // Make sure user is logged in and is an admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }
  
  if (!issue) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Issue Not Found</h2>
        <p className="text-gray-500 mb-6">The issue you're looking for does not exist.</p>
        <Button onClick={() => navigate('/admin/issues')}>Back to Issues</Button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: IssueStatus) => {
    setStatus(newStatus);
    updateIssueStatus(issue.id, newStatus);
  };

  const handlePriorityChange = (newPriority: IssuePriority) => {
    setPriority(newPriority);
    updateIssuePriority(issue.id, newPriority);
  };

  const handleAssignToSelf = () => {
    setIsSaving(true);
    assignIssue(issue.id, user.id);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/issues')}
          className="mr-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{issue.title}</h1>
          <div className="flex gap-2 mt-2">
            <IssueStatusBadge status={issue.status} />
            <CategoryBadge category={issue.category} />
            <PriorityBadge priority={issue.priority} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="text-gray-500 mb-2 text-sm">Description</div>
                  <p className="text-gray-800 whitespace-pre-line">{issue.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <div className="text-gray-500 mb-1 text-sm">Submitted</div>
                    <div className="text-gray-800">
                      {format(new Date(issue.createdAt), 'PPP')} 
                      <span className="text-gray-500 text-sm ml-2">
                        ({formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 mb-1 text-sm">Last Updated</div>
                    <div className="text-gray-800">
                      {format(new Date(issue.updatedAt), 'PPP')}
                      <span className="text-gray-500 text-sm ml-2">
                        ({formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 mb-1 text-sm">Submitted By</div>
                    <div className="text-gray-800 flex items-center">
                      {issue.isAnonymous ? (
                        <span>Anonymous</span>
                      ) : (
                        <span className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                            <User className="h-3 w-3" />
                          </div>
                          {issue.studentName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!issue.isAnonymous && issue.studentEmail && (
                    <div>
                      <div className="text-gray-500 mb-1 text-sm">Contact Email</div>
                      <div className="text-gray-800 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <a href={`mailto:${issue.studentEmail}`} className="text-campus-600 hover:underline">
                          {issue.studentEmail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <IssueComments issueId={issue.id} comments={issue.comments} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issue Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <Select 
                  value={status} 
                  onValueChange={(value) => handleStatusChange(value as IssueStatus)}
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
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Priority</h3>
                <Select 
                  value={priority} 
                  onValueChange={(value) => handlePriorityChange(value as IssuePriority)}
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
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Assignment</h3>
                {issue.assignedTo ? (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-600">Currently assigned to:</div>
                    <div className="font-medium">{user.name}</div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleAssignToSelf}
                    disabled={isSaving}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Assign to Me
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Flag className="h-3 w-3" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Issue Created</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(issue.createdAt), 'PPP p')}
                    </div>
                  </div>
                </div>
                
                {issue.status === 'in-progress' && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <User className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Assigned & In Progress</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(issue.updatedAt), 'PPP p')}
                      </div>
                    </div>
                  </div>
                )}
                
                {issue.status === 'resolved' && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Issue Resolved</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(issue.updatedAt), 'PPP p')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminIssueDetail;
