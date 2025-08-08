
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSocialContent } from '@/hooks/useSocialContent';
import SocialMediaCard from './SocialMediaCard';
import BibleChapterDisplay from './BibleChapterDisplay';

interface BibleChapterWithVideosProps {
  bookName: string;
  chapterNumber: number;
  videoCount: number;
  selectedTranslation?: string;
}

const BibleChapterWithVideos: React.FC<BibleChapterWithVideosProps> = ({
  bookName,
  chapterNumber,
  videoCount,
  selectedTranslation = 'ESV'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { content, loading } = useSocialContent(bookName, chapterNumber);

  const youtubeContent = content.filter(item => item.content_type === 'youtube');
  const twitterContent = content.filter(item => item.content_type === 'twitter');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {bookName} {chapterNumber}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? 'Hide' : 'Show'} Chapter
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex gap-2">
          {youtubeContent.length > 0 && (
            <Badge variant="secondary">
              📺 {youtubeContent.length} video{youtubeContent.length !== 1 ? 's' : ''}
            </Badge>
          )}
          {twitterContent.length > 0 && (
            <Badge variant="outline">
              🐦 {twitterContent.length} tweet{twitterContent.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Bible Chapter Text */}
          <BibleChapterDisplay 
            bookName={bookName}
            chapterNumber={chapterNumber}
            translation={selectedTranslation}
          />
          
          {/* Related Content */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Related Content</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading content...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {content.length > 0 ? (
                  content.map((item) => (
                    <SocialMediaCard key={item.id} content={item} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No related content available for this chapter.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BibleChapterWithVideos;
