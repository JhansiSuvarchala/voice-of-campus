
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the dashboard instead of root
    navigate('/dashboard');
  }, [navigate]);
  
  return null;
};

export default Index;
