
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IssuePriority } from '@/contexts/DataContext';
import { Flag } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityDetails = (priority: IssuePriority) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Low',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      case 'medium':
        return {
          label: 'Medium',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        };
      case 'high':
        return {
          label: 'High',
          className: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        };
      case 'urgent':
        return {
          label: 'Urgent',
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const { label, className } = getPriorityDetails(priority);

  return (
    <Badge variant="outline" className={className}>
      <span className="flex items-center">
        <Flag className="h-3 w-3 mr-1" />
        {label}
      </span>
    </Badge>
  );
};

export default PriorityBadge;
