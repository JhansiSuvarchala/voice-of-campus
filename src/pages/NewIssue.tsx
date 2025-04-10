
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueCategory, IssuePriority } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'academics', label: 'Academics' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'extracurricular', label: 'Extracurricular' },
  { value: 'other', label: 'Other' }
];

const priorities: { value: IssuePriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const NewIssue: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addIssue } = useData();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('academics');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Make sure user is logged in and is a student
  if (!user || user.role !== 'student') {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new issue
    const newIssue = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      isAnonymous,
      status: 'pending' as const,
      studentId: isAnonymous ? null : user.id,
      studentName: isAnonymous ? null : user.name,
      studentEmail: isAnonymous ? null : user.email,
      assignedTo: null,
      rating: null
    };
    
    // Add issue to the data context
    addIssue(newIssue);
    
    // Redirect to my issues page
    navigate('/my-issues');
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div>
        <h1 className="text-2xl font-bold">Submit New Issue</h1>
        <p className="text-gray-500">Share your concern or suggestion</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief title for your issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about your issue or suggestion"
                className="min-h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={(value) => setCategory(value as IssueCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={priority} 
                  onValueChange={(value) => setPriority(value as IssuePriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(pri => (
                      <SelectItem key={pri.value} value={pri.value}>
                        {pri.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous">Submit anonymously</Label>
              {isAnonymous && (
                <span className="text-sm text-gray-500 ml-2">
                  Your identity will be hidden from administration
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewIssue;
