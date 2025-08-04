import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BibleReader from '@/components/BibleReader';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto px-4">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Bible Study App</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience scripture like never before with personal study tools, highlighting, notes, and social media integration.
          </p>
          <div className="space-y-4">
            <Button onClick={() => navigate('/auth')} size="lg">
              Get Started
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Multiple Translations</h3>
                <p className="text-sm text-muted-foreground">Read ESV, NIV, NASB, KJV and more</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary">✏️</span>
                </div>
                <h3 className="font-semibold mb-2">Study Tools</h3>
                <p className="text-sm text-muted-foreground">Highlight, annotate, and organize your thoughts</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary">📱</span>
                </div>
                <h3 className="font-semibold mb-2">Social Integration</h3>
                <p className="text-sm text-muted-foreground">Discover content from trusted ministry sources</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <BibleReader />;
};

export default Index;
