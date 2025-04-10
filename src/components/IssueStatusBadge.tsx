
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IssueStatus } from '@/contexts/DataContext';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface IssueStatusBadgeProps {
  status: IssueStatus;
}

const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status }) => {
  const getStatusDetails = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        };
      case 'resolved':
        return {
          label: 'Resolved',
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
        };
      default:
        return {
          label: 'Unknown',
          icon: null,
          className: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const { label, icon, className } = getStatusDetails(status);

  return (
    <Badge variant="outline" className={className}>
      <span className="flex items-center">
        {icon}
        {label}
      </span>
    </Badge>
  );
};

export default IssueStatusBadge;
