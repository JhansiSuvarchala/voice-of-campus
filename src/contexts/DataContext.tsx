
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type IssueCategory = 'academics' | 'hostel' | 'facilities' | 'extracurricular' | 'other';
export type IssueStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface IssueComment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'admin';
  text: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  studentId: string | null;
  studentName: string | null;
  studentEmail: string | null;
  assignedTo: string | null;
  comments: IssueComment[];
  rating: number | null;
}

interface DataContextType {
  issues: Issue[];
  userIssues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  updateIssuePriority: (issueId: string, priority: IssuePriority) => void;
  assignIssue: (issueId: string, adminId: string) => void;
  addComment: (issueId: string, comment: Omit<IssueComment, 'id' | 'createdAt'>) => void;
  rateResolution: (issueId: string, rating: number) => void;
  getIssueById: (issueId: string) => Issue | undefined;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children, userId }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch data from backend
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load from localStorage or use mock data
        const savedIssues = localStorage.getItem('campusVoiceIssues');
        
        if (savedIssues) {
          setIssues(JSON.parse(savedIssues));
        } else {
          // Mock data for demonstration
          const mockIssues: Issue[] = [
            {
              id: '1',
              title: 'Poor WiFi in Science Building',
              description: 'The WiFi connection in the Science Building drops frequently, making it difficult to access online resources during class.',
              category: 'facilities',
              status: 'in-progress',
              priority: 'high',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              isAnonymous: false,
              studentId: 'student-2',
              studentName: 'Alex Johnson',
              studentEmail: 'alex.johnson@campus.edu',
              assignedTo: 'admin-1',
              comments: [
                {
                  id: 'c1',
                  issueId: '1',
                  userId: 'admin-1',
                  userName: 'Admin User',
                  userRole: 'admin',
                  text: 'We are looking into this issue and have contacted the IT department.',
                  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                }
              ],
              rating: null,
            },
            {
              id: '2',
              title: 'Need Extended Library Hours',
              description: 'With exams approaching, it would be helpful if the library could stay open until midnight instead of closing at 9 PM.',
              category: 'academics',
              status: 'pending',
              priority: 'medium',
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              isAnonymous: true,
              studentId: null,
              studentName: null,
              studentEmail: null,
              assignedTo: null,
              comments: [],
              rating: null,
            },
            {
              id: '3',
              title: 'Cafeteria Food Quality Issues',
              description: 'The quality of food in the main cafeteria has declined. Several students found undercooked meals last week.',
              category: 'facilities',
              status: 'resolved',
              priority: 'high',
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              isAnonymous: false,
              studentId: 'student-3',
              studentName: 'Sam Taylor',
              studentEmail: 'sam.taylor@campus.edu',
              assignedTo: 'admin-1',
              comments: [
                {
                  id: 'c2',
                  issueId: '3',
                  userId: 'admin-1',
                  userName: 'Admin User',
                  userRole: 'admin',
                  text: 'We have spoken with the cafeteria management and they are implementing new quality control measures.',
                  createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                  id: 'c3',
                  issueId: '3',
                  userId: 'student-3',
                  userName: 'Sam Taylor',
                  userRole: 'student',
                  text: 'Thank you for addressing this quickly. I noticed improvement already.',
                  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                }
              ],
              rating: 4,
            }
          ];
          
          setIssues(mockIssues);
          localStorage.setItem('campusVoiceIssues', JSON.stringify(mockIssues));
        }
      } catch (error) {
        toast.error('Failed to load issues');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userIssues = userId 
    ? issues.filter(issue => issue.studentId === userId || 
        (issue.assignedTo === userId))
    : [];

  const saveIssues = (updatedIssues: Issue[]) => {
    setIssues(updatedIssues);
    localStorage.setItem('campusVoiceIssues', JSON.stringify(updatedIssues));
  };

  const addIssue = (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      ...issue,
      id: `issue-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      comments: [],
    };
    
    const updatedIssues = [...issues, newIssue];
    saveIssues(updatedIssues);
    toast.success('Issue submitted successfully');
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status, updatedAt: new Date().toISOString() } 
        : issue
    );
    saveIssues(updatedIssues);
    toast.success(`Issue status updated to ${status}`);
  };

  const updateIssuePriority = (issueId: string, priority: IssuePriority) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, priority, updatedAt: new Date().toISOString() } 
        : issue
    );
    saveIssues(updatedIssues);
    toast.success(`Issue priority updated to ${priority}`);
  };

  const assignIssue = (issueId: string, adminId: string) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, assignedTo: adminId, updatedAt: new Date().toISOString() } 
        : issue
    );
    saveIssues(updatedIssues);
    toast.success('Issue assigned successfully');
  };

  const addComment = (issueId: string, commentData: Omit<IssueComment, 'id' | 'createdAt'>) => {
    const newComment: IssueComment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            comments: [...issue.comments, newComment],
            updatedAt: new Date().toISOString(),
          } 
        : issue
    );
    saveIssues(updatedIssues);
    toast.success('Comment added');
  };

  const rateResolution = (issueId: string, rating: number) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, rating, updatedAt: new Date().toISOString() } 
        : issue
    );
    saveIssues(updatedIssues);
    toast.success('Thank you for your feedback');
  };

  const getIssueById = (issueId: string) => {
    return issues.find(issue => issue.id === issueId);
  };

  return (
    <DataContext.Provider
      value={{
        issues,
        userIssues,
        addIssue,
        updateIssueStatus,
        updateIssuePriority,
        assignIssue,
        addComment,
        rateResolution,
        getIssueById,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
