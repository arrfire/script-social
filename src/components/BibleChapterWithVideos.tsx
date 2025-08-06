import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import SocialMediaCard from './SocialMediaCard';
import { useSocialContent } from '@/hooks/useSocialContent';

interface ChapterData {
  book_name: string;
  chapter_number: number;
  video_count: number;
}

interface BibleChapterWithVideosProps {
  chapter: ChapterData;
}

const BibleChapterWithVideos = ({ chapter }: BibleChapterWithVideosProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { content: socialContent, loading } = useSocialContent(
    isExpanded ? chapter.book_name : undefined, 
    isExpanded ? chapter.chapter_number : undefined
  );

  return (
    <Card className="mb-4">
      <CardHeader>
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-xl">
              {chapter.book_name} Chapter {chapter.chapter_number}
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Play className="h-3 w-3" />
              {chapter.video_count} video{chapter.video_count !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          ) : socialContent.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-3">
                Related videos for {chapter.book_name} {chapter.chapter_number}:
              </div>
              <div className="grid gap-3">
                {socialContent.map((item) => (
                  <SocialMediaCard key={item.id} content={item} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No related content found for this chapter.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default BibleChapterWithVideos;