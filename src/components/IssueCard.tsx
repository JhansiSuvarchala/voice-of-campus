
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, XCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Issue, IssueStatus } from '@/contexts/DataContext';

interface IssueCardProps {
  issue: Issue;
  isAdmin?: boolean;
}

const getStatusIcon = (status: IssueStatus) => {
  switch (status) {
    case 'resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'academics':
      return 'bg-blue-100 text-blue-800';
    case 'hostel':
      return 'bg-green-100 text-green-800';
    case 'facilities':
      return 'bg-purple-100 text-purple-800';
    case 'extracurricular':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const IssueCard: React.FC<IssueCardProps> = ({ issue, isAdmin = false }) => {
  const linkPath = isAdmin 
    ? `/admin/issues/${issue.id}` 
    : `/my-issues/${issue.id}`;

  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(issue.status)}
            <span className="capitalize text-sm font-medium">{issue.status}</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getCategoryColor(issue.category)}>
              {issue.category}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(issue.priority)}>
              {issue.priority}
            </Badge>
          </div>
        </div>
        
        <Link to={linkPath} className="block">
          <h3 className="text-lg font-medium mb-2 hover:text-campus-600 transition-colors">
            {issue.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {issue.description}
          </p>
        </Link>
        
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span>
            Submitted {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </span>
          {issue.isAnonymous ? (
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">Anonymous</span>
          ) : (
            <span className="ml-auto">{issue.studentName}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{issue.comments.length} comments</span>
        </div>
        
        <div className="ml-auto">
          Last updated {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
