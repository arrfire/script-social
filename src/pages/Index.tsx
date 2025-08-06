
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BibleReader from '@/components/BibleReader';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <BibleReader />;
};

export default Index;
