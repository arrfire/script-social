
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Play, BookOpen } from 'lucide-react';
import SocialMediaCard from './SocialMediaCard';
import { useSocialContent } from '@/hooks/useSocialContent';
import { useBibleVerses } from '@/hooks/useBibleVerses';

interface ChapterData {
  book_name: string;
  chapter_number: number;
  video_count: number;
}

interface BibleChapterWithVideosProps {
  chapter: ChapterData;
  selectedTranslation: string;
}

const BibleChapterWithVideos = ({ chapter, selectedTranslation }: BibleChapterWithVideosProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { content: socialContent, loading: socialLoading } = useSocialContent(
    isExpanded ? chapter.book_name : undefined, 
    isExpanded ? chapter.chapter_number : undefined
  );
  const { verses, loading: versesLoading } = useBibleVerses(
    isExpanded ? chapter.book_name : undefined,
    isExpanded ? chapter.chapter_number : undefined,
    selectedTranslation
  );

  const getVerseText = (verse: any) => {
    switch (selectedTranslation.toLowerCase()) {
      case 'niv': return verse.text_niv;
      case 'nasb': return verse.text_nasb;
      case 'kjv': return verse.text_kjv;
      default: return verse.text_esv;
    }
  };

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
        <CardContent className="space-y-6">
          {/* Bible Verses Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">
                {chapter.book_name} {chapter.chapter_number} ({selectedTranslation})
              </h3>
            </div>
            
            {versesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : verses.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto bg-muted/30 p-4 rounded-lg">
                {verses.map((verse) => {
                  const text = getVerseText(verse);
                  return text ? (
                    <p key={verse.id} className="text-sm leading-relaxed">
                      <span className="font-semibold text-primary mr-2">
                        {verse.verse_number}
                      </span>
                      {text}
                    </p>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No verses found for this chapter.
              </p>
            )}
          </div>

          {/* Related Videos Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Related Videos</h3>
            {socialLoading ? (
              <div className="grid gap-3 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : socialContent.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {socialContent.map((item) => (
                  <SocialMediaCard key={item.id} content={item} compact />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No related videos found for this chapter.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BibleChapterWithVideos;
