
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChaptersWithContent } from '@/hooks/useChaptersWithContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BibleChapterWithVideos from './BibleChapterWithVideos';

const BibleReader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedTranslation, setSelectedTranslation] = useState('ESV');
  const { chapters, loading } = useChaptersWithContent();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Bible Study</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESV">ESV</SelectItem>
                <SelectItem value="NIV">NIV</SelectItem>
                <SelectItem value="NASB">NASB</SelectItem>
                <SelectItem value="KJV">KJV</SelectItem>
              </SelectContent>
            </Select>
            
            {user ? (
              <>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Bible Chapters with Video Content</CardTitle>
            <p className="text-muted-foreground">
              Explore Bible chapters that have related video content. Click on any chapter to view the Bible text and related videos.
              {!user && (
                <span className="block mt-2 text-sm">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary" 
                    onClick={() => navigate('/auth')}
                  >
                    Sign in
                  </Button>
                  {" "}to save highlights, notes, and track your reading progress.
                </span>
              )}
            </p>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : chapters.length > 0 ? (
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <BibleChapterWithVideos
                key={`${chapter.book_name}-${chapter.chapter_number}`}
                chapter={chapter}
                selectedTranslation={selectedTranslation}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No chapters with video content found.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BibleReader;
