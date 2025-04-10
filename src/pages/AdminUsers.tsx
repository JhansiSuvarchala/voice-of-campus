
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Mail, Filter } from 'lucide-react';
import { toast } from 'sonner';

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  { 
    id: '1', 
    name: 'Amy Johnson',
    email: 'amy.johnson@university.edu',
    studentId: 'STU-2023-001',
    department: 'Computer Science',
    year: '3rd Year',
    issuesSubmitted: 5,
    lastActive: '2025-04-08T10:30:00Z'
  },
  { 
    id: '2', 
    name: 'Michael Chen',
    email: 'michael.chen@university.edu',
    studentId: 'STU-2023-002',
    department: 'Electrical Engineering',
    year: '2nd Year',
    issuesSubmitted: 3,
    lastActive: '2025-04-09T14:15:00Z'
  },
  { 
    id: '3', 
    name: 'Sarah Williams',
    email: 'sarah.williams@university.edu',
    studentId: 'STU-2023-003',
    department: 'Business Administration',
    year: '4th Year',
    issuesSubmitted: 8,
    lastActive: '2025-04-10T09:45:00Z'
  },
  { 
    id: '4', 
    name: 'David Rodriguez',
    email: 'david.rodriguez@university.edu',
    studentId: 'STU-2023-004',
    department: 'Mechanical Engineering',
    year: '1st Year',
    issuesSubmitted: 1,
    lastActive: '2025-04-07T16:20:00Z'
  },
  { 
    id: '5', 
    name: 'Emma Thompson',
    email: 'emma.thompson@university.edu',
    studentId: 'STU-2023-005',
    department: 'Psychology',
    year: '3rd Year',
    issuesSubmitted: 6,
    lastActive: '2025-04-09T11:10:00Z'
  }
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Handle contact user (email)
  const handleContactUser = (email: string) => {
    toast.success(`Email link opened for ${email}`);
    // In a real app, this would open an email client or a message form
  };

  // Handle view user details
  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simple check for admin access
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Users</h1>
        <p className="text-gray-500">Manage and view student accounts</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users by name, email, ID or department..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="md:w-auto"
          onClick={() => toast.info('Filter functionality coming soon')}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button 
          className="md:w-auto"
          onClick={() => toast.info('Add user functionality coming soon')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of student users in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Issues</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      {user.name}
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.studentId}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.year}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{user.issuesSubmitted}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.lastActive)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleContactUser(user.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewUser(user.id)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  <p className="text-gray-500">No users found matching your search criteria</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
