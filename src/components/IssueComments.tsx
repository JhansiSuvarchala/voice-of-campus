
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useData, IssueComment } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Send } from 'lucide-react';

interface IssueCommentsProps {
  issueId: string;
  comments: IssueComment[];
}

const IssueComments: React.FC<IssueCommentsProps> = ({ issueId, comments }) => {
  const { user } = useAuth();
  const { addComment } = useData();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user || !newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Add the new comment
    addComment(issueId, {
      issueId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      text: newComment.trim()
    });
    
    // Reset state
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium mb-4">Comments ({comments.length})</h3>
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {comment.userName}
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
                      {comment.userRole}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-line">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment.
        </div>
      )}
      
      {user && (
        <div className="mt-6">
          <div className="mb-2">
            <Textarea
              placeholder="Add your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-32"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!newComment.trim() || isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueComments;
