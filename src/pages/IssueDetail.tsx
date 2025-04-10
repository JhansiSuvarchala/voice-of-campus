
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import IssueStatusBadge from '@/components/IssueStatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import PriorityBadge from '@/components/PriorityBadge';
import IssueComments from '@/components/IssueComments';
import { ChevronLeft, User } from 'lucide-react';

const IssueDetail: React.FC = () => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getIssueById } = useData();
  
  const issue = getIssueById(issueId || '');
  
  if (!issue) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Issue Not Found</h2>
        <p className="text-gray-500 mb-6">The issue you're looking for does not exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/my-issues')}>Back to My Issues</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/my-issues')}
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
            </div>
          </div>
        </CardContent>
      </Card>
      
      <IssueComments issueId={issue.id} comments={issue.comments} />
    </div>
  );
};

export default IssueDetail;
