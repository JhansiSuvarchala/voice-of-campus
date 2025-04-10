
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IssueCategory } from '@/contexts/DataContext';
import { BookOpen, Home, Building, Activity, HelpCircle } from 'lucide-react';

interface CategoryBadgeProps {
  category: IssueCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryDetails = (category: IssueCategory) => {
    switch (category) {
      case 'academics':
        return {
          label: 'Academics',
          icon: <BookOpen className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        };
      case 'hostel':
        return {
          label: 'Hostel',
          icon: <Home className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        };
      case 'facilities':
        return {
          label: 'Facilities',
          icon: <Building className="h-3 w-3 mr-1" />,
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        };
      case 'extracurricular':
        return {
          label: 'Extracurricular',
          icon: <Activity className="h-3 w-3 mr-1" />,
          className: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        };
      case 'other':
        return {
          label: 'Other',
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        };
      default:
        return {
          label: 'Unknown',
          icon: <HelpCircle className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const { label, icon, className } = getCategoryDetails(category);

  return (
    <Badge variant="outline" className={className}>
      <span className="flex items-center">
        {icon}
        {label}
      </span>
    </Badge>
  );
};

export default CategoryBadge;
